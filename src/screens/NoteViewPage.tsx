import NiceMarkdown from '@ginpei/react-nice-markdown';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
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
  const { cacheNote, note } = props;

  const [initialized, setInitialized] = useState(Boolean(note));

  useEffect(() => {
    const disconnect = connectNote(
      noteId,
      (note) => {
        if (note) {
          cacheNote(note);
        }
      },
      noop,
      () => setInitialized(true),
    );
    return disconnect;
  }, [cacheNote, noteId]);

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

  return (
    <AppLayout>
      <p>
        <Link to={notePath(note, 'write')}>Write</Link>
      </p>
      <hr/>
      <NiceMarkdown content={note.body} />
    </AppLayout>
  );
}

export default connect(mapState, mapDispatch)(NoteWritePage);
