import { createStore, combineReducers, Dispatch } from "redux";
import { NoteAction, NoteState, reduceNotes } from "./Notes";

export type AppAction =
  | NoteAction;
export type AppDispatch = Dispatch<AppAction>;
export type AppState = {
  notes: NoteState;
};

export function createAppStore () {
  const rootReducer = combineReducers<AppState>({
    notes: reduceNotes,
  });

  const store = createStore<AppState, AppAction, {}, {}>(
    rootReducer,
  );

  return store;
}
