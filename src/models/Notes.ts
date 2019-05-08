import firebase from "../middleware/firebase";
import { noop } from "../misc";
import { Reducer } from "redux";

export interface INote {
  body: string;
  id: string;
  title: string;
  updatedAt: firebase.firestore.Timestamp;
  userId: string;
}

export function snapshotToNote (
  s: firebase.firestore.QueryDocumentSnapshot,
): INote;
export function snapshotToNote (
  s: firebase.firestore.DocumentSnapshot,
): INote | null;
export function snapshotToNote (
  s: firebase.firestore.QueryDocumentSnapshot | firebase.firestore.DocumentSnapshot,
): INote | null {
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
  onNext: (notes: INote[]) => void,
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
  onNext: (note: INote | null) => void,
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

export function saveNote(note: INote) {
  const coll = getNoteCollection();
  const doc = coll.doc(note.id);
  return doc.set(note);
}

export function now () {
  return firebase.firestore.Timestamp.now();
}

export interface INoteDocs {
  [id: string]: INote;
}

export interface INoteState {
  docs: INoteDocs;
  userNoteIds: string[];
}

const initialState: INoteState = {
  docs: {},
  userNoteIds: [],
};

interface ICacheNoteAction {
  note: INote;
  type: 'notes/cache';
};

export function acCacheNote (note: INote): ICacheNoteAction {
  return {
    note,
    type: 'notes/cache',
  };
};

interface ISetUserNotesAction {
  notes: INote[];
  type: 'notes/SetUserNotes';
};

export function acSetUserNotes (notes: INote[]): ISetUserNotesAction {
  return {
    notes,
    type: 'notes/SetUserNotes',
  };
};

export type NoteAction =
  | ICacheNoteAction
  | ISetUserNotesAction;

const reduceDocs: Reducer<INoteDocs, NoteAction> = (state = {}, action) => {
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
  INoteState,
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
