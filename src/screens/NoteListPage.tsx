import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import AppLayout from '../independents/AppLayout';
import firebase from '../middleware/firebase';
import { dateToString, noop } from '../misc';
import { acCacheNote, acSetUserNotes, connectUserNotes, createNote, getNoteTitle, Note, notePath } from '../models/Notes';
import { AppDispatch, AppState } from '../models/store';
import InitializingPage from './InitializingPage';

const NoteListItem: React.FC<{ note: Note }> = ({ note }) => {
  const title = getNoteTitle(note);
  const path = notePath(note, 'write');

  return (
    <li>
      <Link to={path}>{title}</Link>
    </li>
  );
};

interface StateProps {
  notes: Note[];
}

const mapState = ({ notes }: AppState): StateProps => ({
  notes: notes.userNoteIds.map((id) => notes.docs[id]),
});

interface DispatchProps {
  cacheNote: (note: Note) => void;
  setUserNotes: (notes: Note[]) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
  cacheNote: (note) => dispatch(acCacheNote(note)),
  setUserNotes: (notes) => dispatch(acSetUserNotes(notes)),
});

type PageProps =
  & RouteComponentProps
  & StateProps
  & DispatchProps;

const NoteListPage: React.FC<PageProps> = (props) => {
  const [initialized, setInitialized] = useState(props.notes.length > 0);
  const [working, setWorking] = useState(false);

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

  if (!initialized || working) {
    return (
      <InitializingPage/>
    );
  }

  const onCreateClick = async () => {
    setWorking(true);

    const body = `# New note at ${dateToString(new Date())}\n\n`;
    const note = await createNote(user!.uid, { body });
    const path = notePath(note, 'write');
    props.history.push(path);
  };

  return (
    <AppLayout>
      <h1>Notes</h1>
      <p>
        <span
          className="link"
          onClick={onCreateClick}
        >
          Write new note
        </span>
      </p>
      <ul>
        {props.notes.length <= 0 && (
          <li>No notes</li>
        )}
        {props.notes.map((note) => (
          <NoteListItem
            key={note.id}
            note={note}
          />
        ))}
      </ul>
    </AppLayout>
  );
}

export default connect(mapState, mapDispatchToProps)(NoteListPage);
