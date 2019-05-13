import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog, { DialogHeading, DialogInput, DialogLink, DialogSection, DialogSelect, DialogTitle } from '../independents/Dialog';
import { acCacheNote, acDeleteNote, deleteNote, getNoteTitle, Note, updateNote } from '../models/Notes';
import { AppDispatch } from '../models/store';

interface DispatchProps {
  // updateNote: (note: Note) => void;
}

const mapDispatch = (dispatch: AppDispatch): DispatchProps => ({
  // updateNote: (note) => dispatch(acCacheNote(note)),
});

interface OwnProps {
  back: () => void;
}

type ComponentProps =
  & DispatchProps
  & OwnProps;

const EditorSettingsDialog: React.FC<ComponentProps> = (props) => {
  const [fontSize, setTitle] = useState(16);

  const onFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fontSize = Number(event.currentTarget.value);
    // updateNote({
    //   ...props.note,
    //   title: fontSize,
    // })
    setTitle(fontSize);
  };

  return (
    <Dialog>
      <DialogTitle>Editor settings</DialogTitle>
      <p className="container link" onClick={props.back}>← Back</p>
      <DialogSection>
        <DialogInput
          label="Font size"
          onChange={onFontSizeChange}
          type="number"
          value={fontSize}
        />
      </DialogSection>
    </Dialog>
  );
};

export default connect(null, mapDispatch)(EditorSettingsDialog);
