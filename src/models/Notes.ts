import { Reducer } from "redux";
import firebase from "../middleware/firebase";
import { noop } from "../misc";

export interface Note {
  body: string;
  id: string;
  title: string;
  updatedAt: firebase.firestore.Timestamp;
  userId: string;
}

const emptyNote: Note = {
  body: '',
  id: '',
  title: '',
  updatedAt: new firebase.firestore.Timestamp(0, 0),
  userId: '',
};

export function getNoteTitle (note: Note) {
  if (note.title) {
    return note.title;
  }

  const body = note.body.trim();
  if (body.startsWith('# ')) {
    return body.split('\n')[0].slice(2);
  }

  return 'New note';
}

export function snapshotToNote (
  s: firebase.firestore.QueryDocumentSnapshot,
): Note;
export function snapshotToNote (
  s: firebase.firestore.DocumentSnapshot,
): Note | null;
export function snapshotToNote (
  s: firebase.firestore.QueryDocumentSnapshot | firebase.firestore.DocumentSnapshot,
): Note | null {
  const data = s.data();

  if (!data) {
    console.warn('Invalid note', s.id);
    throw new Error('This note is gone');
  }

  if (!data.userId) {
    console.warn('Invalid note', data);
    throw new Error('Invalid note');
  }

  return {
    body: data.body || '',
    id: s.id,
    title: data.title || '',
    updatedAt: data.updatedAt,
    userId: data.userId,
  };
}

export function getNoteCollection () {
  return firebase.firestore().collection('notes');
}

export function connectUserNotes(
  userId: string,
  onNext: (notes: Note[]) => void,
  onError: (error: Error) => void = noop,
  onAny: () => void = noop,
) {
  const ref = getNoteCollection();
  const query = ref.where('userId', '==', userId);
  return query.onSnapshot(
    (snapshot) => {
      const notes = snapshot.docs.map((v) => snapshotToNote(v));
      onNext(notes);
      onAny();
    },
    (error) => {
      onError(error);
      onAny();
    },
  );
}

export function connectNote(
  noteId: string,
  onNext: (note: Note | null) => void,
  onError: (error: Error) => void = noop,
  onAny: () => void = noop,
) {
  const ref = getNoteCollection();
  const query = ref.doc(noteId);
  return query.onSnapshot(
    (snapshot) => {
      const note = snapshotToNote(snapshot);
      onNext(note);
      onAny();
    },
    (error) => {
      onError(error);
      onAny();
    },
  );
}

export function saveNote(note: Note) {
  const coll = getNoteCollection();
  const doc = coll.doc(note.id);
  return doc.set(note);
}

export async function createNote(userId: string, initial?: Partial<Note>) {
  if (!userId) {
    throw new Error('User ID must be given');
  }

  const coll = getNoteCollection();
  const note = {
    ...emptyNote,
    ...initial,
    userId,
  };
  const ref = await coll.add(note);
  note.id = ref.id;
  return note;
}

export function now () {
  return firebase.firestore.Timestamp.now();
}

export interface NoteDocs {
  [id: string]: Note;
}

export interface NoteState {
  docs: NoteDocs;
  userNoteIds: string[];
}

const initialState: NoteState = {
  docs: {},
  userNoteIds: [],
};

interface CacheNoteAction {
  note: Note;
  type: 'notes/cache';
};

export function acCacheNote (note: Note): CacheNoteAction {
  return {
    note,
    type: 'notes/cache',
  };
};

interface SetUserNotesAction {
  notes: Note[];
  type: 'notes/SetUserNotes';
};

export function acSetUserNotes (notes: Note[]): SetUserNotesAction {
  return {
    notes,
    type: 'notes/SetUserNotes',
  };
};

export type NoteAction =
  | CacheNoteAction
  | SetUserNotesAction;

const reduceDocs: Reducer<NoteDocs, NoteAction> = (state = {}, action) => {
  switch (action.type) {
    case 'notes/cache':
      return {
        ...state,
        [action.note.id]: action.note,
      };
    case 'notes/SetUserNotes': {
      const docs = { ...state };
      action.notes.forEach((note) => {
        docs[note.id] = note;
      });
      return docs;
    }
    default:
      return state;
  }
}

export const reduceNotes: Reducer<
  NoteState,
  NoteAction
> = (state = initialState, action) => {
  switch (action.type) {
    case 'notes/cache':
      return {
        ...state,
        docs: reduceDocs(state.docs, action),
      };
    case 'notes/SetUserNotes':
      return {
        ...state,
        docs: reduceDocs(state.docs, action),
        userNoteIds: action.notes.map((v) => v.id),
      };
    default:
      return state;
  }
}
