import { Reducer } from "redux";
import firebase from '../middleware/firebase';
import { noop } from "../misc";

export interface EditorPreferences {
  fontSize: number;
  id: string; // user ID
  updatedAt: firebase.firestore.Timestamp,
}

const initialState: EditorPreferences = {
  fontSize: 16,
  id: '',
  updatedAt: new firebase.firestore.Timestamp(0, 0),
};

// ----------------------------------------------------------------------------
// Actions

interface SetAction {
  editorPreferences: EditorPreferences;
  type: 'editorPreferences/set',
}

export function acSetEditorPreferences (
  editorPreferences: EditorPreferences,
): SetAction {
  return {
    editorPreferences,
    type: 'editorPreferences/set',
  };
}

export type EditorPreferencesAction =
  | SetAction;

export const reduceEditorPreferences: Reducer<
  EditorPreferences,
  EditorPreferencesAction
> = (state = initialState, action) => {
  switch (action.type) {
    case 'editorPreferences/set':
      return action.editorPreferences;
    default:
      return state;
  }
}

// ----------------------------------------------------------------------------
// Firebase wrappers

export function getNoteCollection () {
  return firebase.firestore().collection('editorPreferences');
}

export function snapshotToRecord (
  s: firebase.firestore.DocumentSnapshot,
): EditorPreferences {
  const data = s.data();

  if (!data) {
    console.warn('User ID', s.id);
    throw new Error('Failed to fetch editor preference record');
  }

  return {
    fontSize: data.fontSize || 16,
    id: s.id,
    updatedAt: data.updatedAt,
  };
}

export function saveEditorPreferences (
  pref: EditorPreferences,
  updatedAt?: firebase.firestore.Timestamp,
) {
  const ref = getNoteCollection();
  const query = ref.doc(pref.id);
  const data: EditorPreferences = {
    ...pref,
    updatedAt: updatedAt || firebase.firestore.Timestamp.now(),
  };
  query.set(data);
}

// ----------------------------------------------------------------------------
// Connectors

export function connectUserEditorPreferences(
  userId: string,
  onNext: (preferences: EditorPreferences) => void,
  onError: (error: firebase.firestore.FirestoreError) => void = noop,
  onAny: () => void = noop,
) {
  const ref = getNoteCollection();
  const query = ref.doc(userId);
  return query.onSnapshot(
    (snapshot) => {
      try {
        const data = snapshotToRecord(snapshot);
        onNext(data);
      } catch (error) {
        onError(error);
        return;
      }
      onAny();
    },
    (error) => {
      onError(error as firebase.firestore.FirestoreError);
      onAny();
    },
  );
}
