import { noop } from "@babel/types";

export interface INote {
  body: string;
  id: string;
  title: string;
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
    userId: data.userId,
  };
}

export function getNoteCollection (firestore: firebase.firestore.Firestore) {
  return firestore.collection('notes');
}

export function connectUserNotes(
  firestore: firebase.firestore.Firestore,
  userId: string,
  onNext: (notes: INote[]) => void,
  onError: (error: Error) => void = noop,
  onAny: () => void = noop,
) {
  const ref = getNoteCollection(firestore);
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
  firestore: firebase.firestore.Firestore,
  noteId: string,
  onNext: (note: INote | null) => void,
  onError: (error: Error) => void = noop,
  onAny: () => void = noop,
) {
  const ref = getNoteCollection(firestore);
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
