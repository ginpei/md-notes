import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog, { DialogHeading, DialogInput, DialogSection, DialogTitle } from '../independents/Dialog';
import { acSetEditorPreferences, EditorPreferences, saveEditorPreferences } from '../models/EditorPreference';
import { AppDispatch, AppState } from '../models/store';

const EditorPreview = (props: { fontSize: number }) => (
  <div className="container">
    <textarea
      style={{
        fontSize: `${props.fontSize}px`,
        height: '10rem',
        resize: 'none',
        width: '100%',
      }}
      value={`# Lorem ipsum

Dolor sit amet consectetur adipisicing elit.

Placeat libero maxime quis neque omnis nisi eveniet quidem magni similique, facilis nemo nulla in cumque voluptate nostrum culpa repellat velit illo?`}
    />
  </div>
);

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

  const onFontSizeBlur = () => {
    setFontSize(props.editorPreferences.fontSize);
  };

  return (
    <Dialog>
      <DialogTitle>Editor preferences</DialogTitle>
      <p className="container link" onClick={props.back}>← Back</p>
      <DialogSection>
        <DialogInput
          label="Font size"
          max="30"
          min="10"
          onBlur={onFontSizeBlur}
          onChange={onFontSizeChange}
          type="number"
          value={fontSize}
        />
      </DialogSection>
      <DialogSection>
        <DialogHeading>Preview</DialogHeading>
        <EditorPreview fontSize={fontSize} />
      </DialogSection>
    </Dialog>
  );
};

export default connect(mapState, mapDispatch)(EditorPreferencesDialog);
