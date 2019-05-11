import { History } from 'history';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog, { DialogHeading, DialogLink, DialogTitle, DialogInput } from '../independents/Dialog';
import { BackLink } from '../independents/miscComponents';
import { acDeleteNote, deleteNote, getNoteTitle, Note } from '../models/Notes';
import { AppDispatch } from '../models/store';

interface DispatchProps {
  deleteNote: (note: Note) => void;
}

const mapDispatch = (dispatch: AppDispatch): DispatchProps => ({
  deleteNote: (note) => dispatch(acDeleteNote(note)),
});

interface OwnProps {
  history: History<any>;
  note: Note;
  onDelete: (note: Note) => void;
  scene?: 'settings-heyYo' | string;
}

type ComponentProps =
  & DispatchProps
  & OwnProps;

const EditorSettingsDialog: React.FC<ComponentProps> = (props) => {
  const { note } = props;

  const [title, setTitle] = useState('Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, voluptatibus fugiat maxime labore sequi et ipsam autem iste voluptates repellat enim cupiditate laborum? Porro sapiente sequi hic nesciunt rerum illo.');

  if (props.scene === 'settings-heyYo') {
    return (
      <Dialog>
        <h1>Hey Yo!</h1>
        <p>
          <BackLink history={props.history}>← Back</BackLink>
        </p>
      </Dialog>
    );
  }

  if (props.scene === 'settings-editor') {
    return (
      <Dialog>
        <div className="container">
          <h1>Editor settings</h1>
          <p>
            <BackLink history={props.history}>← Back</BackLink>
          </p>
        </div>
      </Dialog>
    );
  }

  const onDeleteClick = async () => {
    const message = 'Are you sure you want to delete this note permanently?';
    const ok = window.confirm(message);
    if (ok) {
      deleteNote(note);
      props.deleteNote(note);
      props.onDelete(note);
    }
  };

  return (
    <Dialog>
      <DialogTitle>Settings</DialogTitle>
      <DialogLink to="?scene=settings-editor">Editor settings</DialogLink>
      <DialogHeading>Note status</DialogHeading>
      <DialogInput
        description="Leave empty to pick from the first heading automatically."
        label="Title"
        onChange={(event) => setTitle(event.currentTarget.value)}
        value={title}
      />
      <DialogLink to="?scene=settings-editor">Status</DialogLink>

      <hr style={{ marginTop: '3rem' }}/>
      <div className="container">
        <label>
          Title:
          <input type="text" value={getNoteTitle(note)} disabled />
        </label>
        <hr/>
        <label>
          <input type="checkbox" disabled />
          Private
        </label>
        <h2>Danger zone</h2>
        <div className="dangerZone">
          <button
            onClick={onDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default connect(null, mapDispatch)(EditorSettingsDialog);
