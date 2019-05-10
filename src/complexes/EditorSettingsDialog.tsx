import { History } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import Dialog from '../independents/Dialog';
import { BackLink } from '../independents/miscComponents';
import { acDeleteNote, deleteNote, Note } from '../models/Notes';
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
      <h1>Settings</h1>
      <p>
        <span
          className="link"
          onClick={onDeleteClick}
        >
          Delete
        </span>
      </p>
    </Dialog>
  );
};

export default connect(null, mapDispatch)(EditorSettingsDialog);
