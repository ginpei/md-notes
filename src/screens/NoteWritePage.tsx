import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Dialog from '../independents/Dialog';
import { BackLink } from '../independents/miscComponents';
import { getGetParams } from '../misc';

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

const initialContent = new Array(30)
.fill(`Lorem ipsum dolor sit amet consectetur adipisicing elit.

Quibusdam sapiente quis voluptates non odit veniam laboriosam doloribus repudiandae suscipit officiis voluptatem eaque sit pariatur, architecto nostrum exercitationem est dignissimos odio.`)
.join('\n\n');

interface INoteWritePageParams {
  id: string;
}

type INoteWritePageProps =
  & RouteComponentProps<INoteWritePageParams>;

const NoteWritePage: React.FC<INoteWritePageProps> = (props) => {
  // const noteId = props.match.params.id;

  const params = getGetParams(props.location.search);
  const scene = params['scene'] || '';

  const isPreviewing = scene.startsWith('preview');
  const isSetting = scene.startsWith('settings-');

  const [content, setContent] = useState(initialContent);

  const onEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.currentTarget.value;
    setContent(newContent);
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
          <pre>{content}</pre>
        </Dialog>
      )}
    </Outer>
  );
}

export default NoteWritePage;
