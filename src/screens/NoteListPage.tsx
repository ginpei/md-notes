import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import AppLayout from '../independents/AppLayout';
import { dateToString, noop, updatedAtToString } from '../misc';
import { acCacheNote, acSetUserNotes, connectUserNotes, createNote, getNoteTitle, Note, notePath } from '../models/Notes';
import { AppDispatch, AppState } from '../models/store';
import InitializingPage from './InitializingPage';

const UpdatedAt = styled.span`
  color: #999;
  font-size: 0.8em;
`;

const NoteListItem: React.FC<{ note: Note }> = ({ note }) => {
  return (
    <li>
      <Link to={notePath(note)}>{getNoteTitle(note)}</Link>
      {' '}
      <Link to={notePath(note, 'write')}>📝</Link>
      {' '}
      <UpdatedAt>({updatedAtToString(note.updatedAt)})</UpdatedAt>
    </li>
  );
};

interface StateProps {
  loggedIn: boolean;
  notes: Note[];
  userId: string;
}

const mapState = (state: AppState): StateProps => ({
  loggedIn: state.currentUser.loggedIn,
  notes: state.notes.userNoteIds
    .map((id) => state.notes.docs[id])
    .sort((n1, n2) => n2.updatedAt.seconds - n1.updatedAt.seconds),
  userId: state.currentUser.id,
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

  useEffect(() => {
    if (!props.loggedIn) {
      props.setUserNotes([]);
      setInitialized(true);
      return noop;
    }

    return connectUserNotes(
      props.userId,
      (notes) => {
        props.setUserNotes(notes);
        setInitialized(true);
      },
    );
  }, [props.loggedIn, props.userId]);

  if (!initialized || working) {
    return (
      <InitializingPage/>
    );
  }

  const onCreateClick = async () => {
    if (!props.userId) {
      throw new Error('User must have logged in');
    }

    setWorking(true);

    const body = `# New note at ${dateToString(new Date())}\n\n`;
    const note = await createNote(props.userId, { body });
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
