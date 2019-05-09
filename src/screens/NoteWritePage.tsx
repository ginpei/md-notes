import NiceMarkdown from '@ginpei/react-nice-markdown';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Dialog from '../independents/Dialog';
import { BackLink } from '../independents/miscComponents';
import firebase from '../middleware/firebase';
import { getGetParams, noop } from '../misc';
import { acCacheNote, connectNote, deleteNote, Note, now, saveNote } from '../models/Notes';
import { AppDispatch, AppState } from '../models/store';
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

  const [content, setContent] = useState(note ? note.body : '');
  const [initialized, setInitialized] = useState(Boolean(note));
  const [user, setUser] = useState(firebase.auth().currentUser);

  useEffect(() => {
    const auth = firebase.auth();
    return auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (!user) {
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
  }, [user, noteId, initialized]);

  const params = getGetParams(props.location.search);
  const scene = params['scene'] || '';

  const isPreviewing = scene.startsWith('preview');
  const isSetting = scene.startsWith('settings-');

  if (!initialized) {
    return (
      <div>
        🥚
        🐣
        🐥
      </div>
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

      // move now without waiting the deletion completes
      // otherwise connection error occurs
      props.history.push('/notes');
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
