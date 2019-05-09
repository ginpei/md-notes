import { Reducer } from 'redux';

export interface CurrentUserState {
  id: string;
  loggedIn: boolean;
}

const initialState: CurrentUserState = {
  id: '',
  loggedIn: false,
};

interface SetCurrentUserAction {
  user: firebase.User | null,
  type: 'currentUser/set',
}

export function acSetCurrentUser(
  user: firebase.User | null,
): SetCurrentUserAction {
  return {
    user,
    type: 'currentUser/set',
  };
}

export type CurrentUserAction =
  | SetCurrentUserAction;

export const reduceCurrentUser: Reducer<
  CurrentUserState,
  CurrentUserAction
> = (state = initialState, action) => {
  switch (action.type) {
    case 'currentUser/set':
      return {
        id: action.user ? action.user.uid : '',
        loggedIn: Boolean(action.user),
      };
    default:
      return state;
  }
}
