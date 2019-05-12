import { History } from 'history';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog, { DialogHeading, DialogInput, DialogLink, DialogSection, DialogTitle, DialogSelect } from '../independents/Dialog';
import { BackLink } from '../independents/miscComponents';
import { acDeleteNote, deleteNote, Note, getNoteTitle } from '../models/Notes';
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

  const [dangerous, setDangerous] = useState(false);
  const [title, setTitle] = useState('');
  const [access, setAccess] = useState('private');

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
      <DialogSection>
        <DialogHeading>Note status</DialogHeading>
        <DialogInput
          description="Leave empty to pick from the first heading automatically."
          label="Title"
          onChange={(event) => setTitle(event.currentTarget.value)}
          placeholder={getNoteTitle(note)}
          value={title}
        />
        <DialogSelect
          label="Access"
          onChange={(event) => setAccess(event.currentTarget.value)}
          value={access}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </DialogSelect>
      </DialogSection>
      <DialogSection>
        <DialogHeading>General</DialogHeading>
        <DialogLink to="?scene=settings-editor">Editor settings</DialogLink>
        <DialogLink to="?scene=settings-heyYo">Hey Yo</DialogLink>
      </DialogSection>
      <DialogSection className="DialogDangerZone">
        <DialogHeading>Danger zone</DialogHeading>
        <div className="container Dialog-item">
          <button
            disabled={dangerous}
            onClick={() => setDangerous(true)}
          >
            Activate danger zone
          </button>
        </div>
        <div className="container Dialog-item">
          <button
            disabled={!dangerous}
            onClick={onDeleteClick}
          >
            Delete
          </button>
        </div>
      </DialogSection>
    </Dialog>
  );
};

export default connect(null, mapDispatch)(EditorSettingsDialog);
