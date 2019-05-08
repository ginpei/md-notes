import { createStore, combineReducers, Dispatch } from "redux";
import { NoteAction, INoteState, reduceNotes } from "./Notes";

export type AppAction =
  | NoteAction;
export type AppDispatch = Dispatch<AppAction>;
export type AppState = {
  notes: INoteState;
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
