import NiceMarkdown from '@ginpei/react-nice-markdown';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Dialog from '../independents/Dialog';
import { BackLink } from '../independents/miscComponents';
import { getGetParams, noop } from '../misc';
import { acCacheNote, acDeleteNote, connectNote, deleteNote, Note, notePath, now, saveNote } from '../models/Notes';
import { AppDispatch, AppState } from '../models/store';
import InitializingPage from './InitializingPage';
import NotFoundPage from './NotFoundPage';

const Outer = styled.div`
  background-color: snow;
  box-sizing: border-box;
  display: grid;
  grid-template:
    "editor" calc(100% - 2rem)
    "toolbar" 2rem
    / 100%;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
`;

const Editor = styled.textarea`
  border-style: none;
  padding: 0.5em;
  resize: none;
`;

const ToolbarOuter = styled.div`
  white-space: nowrap;
  overflow: scroll;

  button {
    height: 2rem;
    line-height: 2rem;
    width: 5em;
    overflow: hidden;
    vertical-align: top;
    white-space: nowrap;
    padding: 0;
  }
`;

interface PageParams {
  id: string;
}

interface StateProps {
  loggedIn: boolean;
  note: Note;
}

const mapState = (state: AppState, props: PageProps): StateProps => ({
  loggedIn: state.currentUser.loggedIn,
  note: state.notes.docs[props.match.params.id],
});

interface DispatchProps {
  cacheNote: (note: Note) => void;
  deleteNote: (note: Note) => void;
}

const mapDispatch = (dispatch: AppDispatch): DispatchProps => ({
  cacheNote: (note) => dispatch(acCacheNote(note)),
  deleteNote: (note) => dispatch(acDeleteNote(note)),
});

type PageProps =
  & RouteComponentProps<PageParams>
  & StateProps
  & DispatchProps;

const NoteWritePage: React.FC<PageProps> = (props) => {
  const noteId = props.match.params.id;
  const { note } = props;

  const [content, setContent] = useState(note ? note.body : '');
  const [initialized, setInitialized] = useState(Boolean(note));

  useEffect(() => {
    if (!props.loggedIn) {
      setInitialized(true);
      return noop;
    }

    const disconnect = connectNote(
      noteId,
      (note) => {
        // ignore when user updates the data on client side
        if (initialized) {
          return;
        }

        if (note) {
          props.cacheNote(note);
          setContent(note.body);
        }
      },
      noop,
      () => setInitialized(true),
    );
    return disconnect;
  }, [props.loggedIn, noteId, initialized]);

  const params = getGetParams(props.location.search);
  const scene = params['scene'] || '';

  const isPreviewing = scene.startsWith('preview');
  const isSetting = scene.startsWith('settings-');

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

  const onEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.currentTarget.value;
    setContent(newContent);
    saveNote({
      ...note,
      body: newContent,
      updatedAt: now(),
    });
  };

  const onPreviewClick = () => {
    props.history.push('?scene=preview');
  };

  const onSettingsClick = () => {
    props.history.push('?scene=settings-top');
  };

  const onDeleteClick = async () => {
    const message = 'Are you sure you want to delete this note permanently?';
    const ok = window.confirm(message);
    if (ok) {
      deleteNote(note);
      props.deleteNote(note);

      // move now without waiting the deletion completes
      // otherwise connection error occurs
      props.history.push(notePath());
    }
  };

  return (
    <Outer>
      <Editor
        value={content}
        onChange={onEditorChange}
      />
      <ToolbarOuter>
        <button>↩</button>
        <button># 1</button>
        <button>-</button>
        <button style={{ fontWeight: 'bold' }}>B</button>
        <button onClick={onPreviewClick}>👁</button>
        <button onClick={onSettingsClick}>…</button>
      </ToolbarOuter>
      {isSetting && (
        scene === 'settings-heyYo' ? (
          <Dialog>
            <h1>Hey Yo!</h1>
            <p>
              <BackLink history={props.history}>← Back</BackLink>
            </p>
          </Dialog>
        ) : (
          <Dialog>
            <h1>Settings</h1>
            <p>Here comes settings!</p>
            <p>
              <Link to="?scene=settings-heyYo">Hey Yo</Link>
            </p>
            <p>
              <span
                className="link"
                onClick={onDeleteClick}
              >
                Delete
              </span>
            </p>
          </Dialog>
        )
      )}
      {isPreviewing && (
        <Dialog>
          <h1>Preview</h1>
          <NiceMarkdown content={content} />
        </Dialog>
      )}
    </Outer>
  );
}

export default connect(mapState, mapDispatch)(NoteWritePage);
