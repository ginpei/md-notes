import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../independents/AppLayout';
import firebase from '../middleware/firebase';
import { connectUserNotes, INote } from '../models/Notes';
import { noop } from '../misc';

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

    return connectUserNotes(
      user.uid,
      (notes) => {
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
