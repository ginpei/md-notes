import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog, { DialogHeading, DialogInput, DialogLink, DialogSection, DialogSelect, DialogTitle } from '../independents/Dialog';
import { acCacheNote, acDeleteNote, deleteNote, getNoteTitle, Note, updateNote } from '../models/Notes';
import { AppDispatch } from '../models/store';

interface DispatchProps {
  updateNote: (note: Note) => void;
  deleteNote: (note: Note) => void;
}

const mapDispatch = (dispatch: AppDispatch): DispatchProps => ({
  updateNote: (note) => dispatch(acCacheNote(note)),
  deleteNote: (note) => dispatch(acDeleteNote(note)),
});

interface OwnProps {
  back: () => void;
  note: Note;
  onDelete: (note: Note) => void;
  scene?: 'settings-heyYo' | string;
}

type ComponentProps =
  & DispatchProps
  & OwnProps;

const NoteSettingsDialog: React.FC<ComponentProps> = (props) => {
  const { note } = props;

  const [dangerous, setDangerous] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [access, setAccess] = useState('private');

  if (props.scene === 'settings-heyYo') {
    return (
      <Dialog>
        <h1>Hey Yo!</h1>
        <p>
          <span className="link" onClick={props.back}>← Back</span>
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
            <span className="link" onClick={props.back}>← Back</span>
          </p>
        </div>
      </Dialog>
    );
  }

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.currentTarget.value;
    updateNote({
      ...props.note,
      title,
    })
    setTitle(title);
  };

  const onDeleteClick = async () => {
    const message = 'Are you sure you want to delete this note permanently?';
    const ok = window.confirm(message);
    if (ok) {
      deleteNote(note);
      props.deleteNote(note);
      props.back();
      props.onDelete(note);
    }
  };

  return (
    <Dialog>
      <DialogTitle>Note settings</DialogTitle>
      <p className="container link" onClick={props.back}>← Back</p>
      <DialogSection>
        <DialogHeading>Note status</DialogHeading>
        <DialogInput
          description="Leave empty to pick the first heading automatically."
          label="Title"
          onChange={onTitleChange}
          placeholder={getNoteTitle(note)}
          value={title}
        />
        <DialogSelect
          disabled={true}
          label="Access (WIP)"
          onChange={(event) => setAccess(event.currentTarget.value)}
          value={access}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </DialogSelect>
      </DialogSection>
      <DialogSection>
        <DialogHeading>General</DialogHeading>
        <DialogLink to="?scene=settings-editor">Editor preferences</DialogLink>
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

export default connect(null, mapDispatch)(NoteSettingsDialog);
