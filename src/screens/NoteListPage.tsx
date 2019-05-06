import { noop } from '@babel/types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../independents/AppLayout';
import firebase from '../middleware/firebase';

interface INote {
  body: string;
  id: string;
  title: string;
  userId: string;
}

function snapshotToNote (s: firebase.firestore.QueryDocumentSnapshot): INote {
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

type INoteWritePageProps = {};

const NoteListPage: React.FC<INoteWritePageProps> = (props) => {
  const [initialized, setInitialized] = useState(false);

  const [user, setUser] = useState(firebase.auth().currentUser);
  useEffect(() => {
    const auth = firebase.auth();
    return auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  const [notes, setNotes] = useState<INote[]>([]);
  useEffect(() => {
    if (!user) {
      setNotes([]);
      setInitialized(true);
      return noop;
    }

    const firestore = firebase.firestore();
    const collNotes = firestore.collection('notes');
    return collNotes.where('userId', '==', user.uid).onSnapshot(
      (snapshot) => {
        const notes = snapshot.docs.map((v) => snapshotToNote(v));
        setNotes(notes);
        setInitialized(true);
      },
    );
  }, [user]);

  if (!initialized) {
    return (
      <div>
        🥚
        🐣
        🐥
      </div>
    );
  }

  return (
    <AppLayout>
      <h1>Notes</h1>
      <ul>
        {notes.length > 0 ? (
          notes.map((note) => (
            <li key={note.id}>
              <Link to={`/notes/${note.id}/write`}>{note.title}</Link>
            </li>
          ))
        ) : (
          <li>No notes</li>
        )}
      </ul>
    </AppLayout>
  );
}

export default NoteListPage;
