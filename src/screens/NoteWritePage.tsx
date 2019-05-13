import NiceMarkdown from '@ginpei/react-nice-markdown';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import EditorPreferencesDialog from '../complexes/EditorPreferencesDialog';
import NoteSettingsDialog from '../complexes/NoteSettingsDialog';
import AppLayout from '../independents/AppLayout';
import Dialog from '../independents/Dialog';
import { getGetParams, noop } from '../misc';
import { acCacheNote, connectNote, Note, now, saveNote } from '../models/Notes';
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
  fontSize: number;
  loggedIn: boolean;
  note: Note;
}

const mapState = (state: AppState, props: PageProps): StateProps => ({
  fontSize: state.editorPreferences.fontSize,
  loggedIn: state.currentUser.loggedIn,
  note: state.notes.docs[props.match.params.id],
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
  const [errors] = useState<Error[]>([]);

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
      (error) => {
        // 404, which is handled
        if (error.code === 'permission-denied') {
          return;
        }

        errors.push(error);
        console.error('ERR', error);
        setContent('');
      },
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
    if (errors.length > 0) {
      return (
        <AppLayout>
          <h1>Error</h1>
          <ul>
            {errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </AppLayout>
      );
    }

    return (
      <NotFoundPage/>
    );
  }

  const back = () => props.history.goBack();

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

  const onDelete = () => {
    // move now without waiting the deletion completes
    // otherwise connection error occurs
    back();
  };

  return (
    <Outer>
      <Editor
        value={content}
        onChange={onEditorChange}
        style={{
          fontSize: `${props.fontSize}px`,
        }}
      />
      <ToolbarOuter>
        <button>↩</button>
        <button># 1</button>
        <button>-</button>
        <button style={{ fontWeight: 'bold' }}>B</button>
        <button onClick={onPreviewClick}>👁</button>
        <button onClick={onSettingsClick}>…</button>
      </ToolbarOuter>
      {scene === 'settings-editor' && (
        <EditorPreferencesDialog
          back={back}
        />
      )}
      {scene === 'settings-top' && (
        <NoteSettingsDialog
          back={back}
          note={note}
          onDelete={onDelete}
        />
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
