import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AppLayout from '../independents/AppLayout';
import firebase from '../middleware/firebase';
import { noop } from '../misc';
import { acCacheNote, connectUserNotes, INote, INoteDocs, acSetUserNotes } from '../models/Notes';
import { AppDispatch, AppState } from '../models/store';

interface INoteWritePageStateProps {
  notes: INote[];
}

const mapStateToProps = ({ notes }: AppState): INoteWritePageStateProps => ({
  notes: notes.userNoteIds.map((id) => notes.docs[id]),
});

interface INoteWritePageDispatchProps {
  cacheNote: (note: INote) => void;
  setUserNotes: (notes: INote[]) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): INoteWritePageDispatchProps => ({
  cacheNote: (note) => dispatch(acCacheNote(note)),
  setUserNotes: (notes) => dispatch(acSetUserNotes(notes)),
});

type INoteWritePageProps =
  & INoteWritePageStateProps
  & INoteWritePageDispatchProps;

const NoteListPage: React.FC<INoteWritePageProps> = (props) => {
  const [initialized, setInitialized] = useState(props.notes.length > 0);

  const [user, setUser] = useState(firebase.auth().currentUser);
  useEffect(() => {
    const auth = firebase.auth();
    return auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      props.setUserNotes([]);
      setInitialized(true);
      return noop;
    }

    return connectUserNotes(
      user.uid,
      (notes) => {
        props.setUserNotes(notes);
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
        {props.notes.length <= 0 && (
          <li>No notes</li>
        )}
        {props.notes.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}/write`}>{note.title}</Link>
          </li>
          )
        )}
      </ul>
    </AppLayout>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteListPage);
