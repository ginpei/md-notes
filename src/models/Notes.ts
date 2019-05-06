import { noop } from "@babel/types";

export interface INote {
  body: string;
  id: string;
  title: string;
  userId: string;
}

export function snapshotToNote (
  s: firebase.firestore.QueryDocumentSnapshot,
): INote {
  const data = s.data();

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
