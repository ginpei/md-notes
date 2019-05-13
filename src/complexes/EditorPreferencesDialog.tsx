import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog, { DialogHeading, DialogInput, DialogLink, DialogSection, DialogSelect, DialogTitle } from '../independents/Dialog';
import { acCacheNote, acDeleteNote, deleteNote, getNoteTitle, Note, updateNote } from '../models/Notes';
import { AppDispatch, AppState } from '../models/store';
import { EditorPreferences, acSetEditorPreferences, saveEditorPreferences } from '../models/EditorPreference';

interface StateProps {
  editorPreferences: EditorPreferences,
}

const mapState = ({ editorPreferences }: AppState): StateProps => ({
  editorPreferences,
});

interface DispatchProps {
  setEditorPreferences: (pref: EditorPreferences) => void;
}

const mapDispatch = (dispatch: AppDispatch): DispatchProps => ({
  setEditorPreferences: (pref) => dispatch(acSetEditorPreferences(pref)),
});

interface OwnProps {
  back: () => void;
}

type ComponentProps =
  & StateProps
  & DispatchProps
  & OwnProps;

const EditorPreferencesDialog: React.FC<ComponentProps> = (props) => {
  const [fontSize, setFontSize] = useState(props.editorPreferences.fontSize);

  const onFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fontSize = Number(event.currentTarget.value);
    saveEditorPreferences({
      ...props.editorPreferences,
      fontSize,
    });
    setFontSize(fontSize);
  };

  return (
    <Dialog>
      <DialogTitle>Editor preferences</DialogTitle>
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

export default connect(mapState, mapDispatch)(EditorPreferencesDialog);
