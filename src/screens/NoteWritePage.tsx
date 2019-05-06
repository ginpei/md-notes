import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Dialog from '../independents/Dialog';
import { BackLink } from '../independents/miscComponents';
import firebase from '../middleware/firebase';
import { getGetParams, noop } from '../misc';
import { connectNote, INote, now, saveNote } from '../models/Notes';
import NotFoundPage from './NotFoundPage';

// type definition is not ready
const NiceMarkdown = require('@ginpei/react-nice-markdown');

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

interface INoteWritePageParams {
  id: string;
}

type INoteWritePageProps =
  & RouteComponentProps<INoteWritePageParams>;

const NoteWritePage: React.FC<INoteWritePageProps> = (props) => {
  const noteId = props.match.params.id;

  const [content, setContent] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [note, setNote] = useState<INote | null>(null);
  const [user, setUser] = useState(firebase.auth().currentUser);

  useEffect(() => {
    const auth = firebase.auth();
    return auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setNote(null);
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

        setContent(note ? note.body : '');
        setNote(note);
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

export default NoteWritePage;
