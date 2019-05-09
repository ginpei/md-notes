import NiceMarkdown from '@ginpei/react-nice-markdown';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import AppLayout from '../independents/AppLayout';
import { noop } from '../misc';
import { acCacheNote, connectNote, Note, notePath } from '../models/Notes';
import { AppDispatch, AppState } from '../models/store';
import InitializingPage from './InitializingPage';
import NotFoundPage from './NotFoundPage';

interface PageParams {
  id: string;
}

interface StateProps {
  note: Note;
}

const mapState = ({ notes }: AppState, props: PageProps): StateProps => ({
  note: notes.docs[props.match.params.id],
});

interface DispatchProps {
  cacheNote: (note: Note) => void;
}

const mapDispatch = (dispatch: AppDispatch): DispatchProps => ({
  cacheNote: (note) => dispatch(acCacheNote(note)),
});

type PageProps =
  & RouteComponentProps<PageParams>
  & StateProps
  & DispatchProps;

const NoteWritePage: React.FC<PageProps> = (props) => {
  const noteId = props.match.params.id;
  const { note } = props;

  const [initialized, setInitialized] = useState(Boolean(note));

  useEffect(() => {
    const disconnect = connectNote(
      noteId,
      (note) => {
        console.log('# note', note);
        if (note) {
          props.cacheNote(note);
        }
      },
      noop,
      () => setInitialized(true),
    );
    return disconnect;
  }, [noteId]);

  if (!initialized) {
    return (
      <InitializingPage/>
    );
  }

  if (!note) {
    return (
      <NotFoundPage/>
    );
  }

  const onWriteClick = () => {
    props.history.push(notePath(note, 'write'));
  };

  return (
    <AppLayout>
      <p>
        <button
          onClick={onWriteClick}
        >
          Write
        </button>
      </p>
      <hr/>
      <NiceMarkdown content={note.body} />
    </AppLayout>
  );
}

export default connect(mapState, mapDispatch)(NoteWritePage);
