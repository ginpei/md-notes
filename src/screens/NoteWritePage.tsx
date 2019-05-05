import React, { useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';

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

const SettingsDialogOuter = styled.div`
  background-color: #0003;
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
`;

const SettingsDialogInner = styled.article`
  background-color: #fff;
  border-radius: 0.2em;
  height: calc(100% - 2rem);
  left: 1rem;
  position: absolute;
  top: 1rem;
  width: calc(100% - 2rem);
`;

const initialContent = new Array(30)
.fill(`Lorem ipsum dolor sit amet consectetur adipisicing elit.

Quibusdam sapiente quis voluptates non odit veniam laboriosam doloribus repudiandae suscipit officiis voluptatem eaque sit pariatur, architecto nostrum exercitationem est dignissimos odio.`)
.join('\n\n');

interface INoteWritePageParams {
  id: string;
}

interface INoteWritePageProps extends RouteComponentProps<INoteWritePageParams> {
};

function getGetParams (search: string): { [key: string]: string } {
  const pairs = search.slice(1)
    .split('&')
    .map((pair) => pair.split('='));

  const map: { [key: string]: string } = {};
  pairs.forEach(([key, value]) => {
    map[key] = value;
  });

  return map;
}

const NoteWritePage: React.FC<INoteWritePageProps> = (props) => {
  const noteId = props.match.params.id;
  console.log('# noteId', noteId);

  const params = getGetParams(props.location.search);
  const scene = params['scene'] || '';

  const [content, setContent] = useState(initialContent);

  const onEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.currentTarget.value;
    setContent(newContent);
  };

  const onSettingsClick = () => {
    props.history.push('?scene=settings');
  };

  return (
    <Outer>
      <Editor
        value={content}
        onChange={onEditorChange}
      />
      <ToolbarOuter>
        <button>↩</button>
        <button>#</button>
        <button>-</button>
        <button style={{ fontWeight: 'bold' }}>B</button>
        <button onClick={onSettingsClick}>…</button>
      </ToolbarOuter>
      {scene && (
        <SettingsDialogOuter>
          <SettingsDialogInner>
            <h1>Hey</h1>
          </SettingsDialogInner>
        </SettingsDialogOuter>
      )}
    </Outer>
  );
}

export default NoteWritePage;
