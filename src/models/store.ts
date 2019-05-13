import { combineReducers, createStore, Dispatch } from "redux";
import { CurrentUserAction, CurrentUserState, reduceCurrentUser } from "./CurrentUser";
import { EditorPreferences, EditorPreferencesAction, reduceEditorPreferences } from "./EditorPreference";
import { NoteAction, NoteState, reduceNotes } from "./Notes";

export type AppAction =
  | CurrentUserAction
  | EditorPreferencesAction
  | NoteAction;
export type AppDispatch = Dispatch<AppAction>;
export type AppState = {
  currentUser: CurrentUserState;
  editorPreferences: EditorPreferences;
  notes: NoteState;
};

export function createAppStore () {
  const rootReducer = combineReducers<AppState>({
    currentUser: reduceCurrentUser,
    editorPreferences: reduceEditorPreferences,
    notes: reduceNotes,
  });

  const store = createStore<AppState, AppAction, {}, {}>(
    rootReducer,
  );

  return store;
}
