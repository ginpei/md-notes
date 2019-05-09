import { createStore, combineReducers, Dispatch } from "redux";
import { NoteAction, NoteState, reduceNotes } from "./Notes";
import { CurrentUserAction, CurrentUserState, reduceCurrentUser } from "./CurrentUser";

export type AppAction =
  | CurrentUserAction
  | NoteAction;
export type AppDispatch = Dispatch<AppAction>;
export type AppState = {
  currentUser: CurrentUserState;
  notes: NoteState;
};

export function createAppStore () {
  const rootReducer = combineReducers<AppState>({
    currentUser: reduceCurrentUser,
    notes: reduceNotes,
  });

  const store = createStore<AppState, AppAction, {}, {}>(
    rootReducer,
  );

  return store;
}
