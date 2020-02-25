import { Dispatch } from "react";
import {
  AccountState,
  AccountAction,
  AccountActionPayload,
  AccountLogin,
  AccountActionType
} from "./models";
import { deleteLocalData, saveLocalData } from "./storage";

function onAccountLogin(
  state: AccountState<AccountActionPayload>,
  action: AccountAction<AccountLogin>
): AccountState<AccountActionPayload> {
  const payload = action && action.payload;
  if (payload && payload.username) {
    state.username = payload.username;
    state.isLoggedIn = true;
    saveLocalData(state);
  } else {
    state.username = undefined;
    state.isLoggedIn = false;
  }
  return state;
}

function onAccountLogout() {
  deleteLocalData();
  return {
    username: undefined,
    isLoggedIn: false
  };
}

export const reducer = (
  state: AccountState<AccountActionPayload>,
  action: AccountAction<AccountActionPayload>,
  dispatch: Dispatch<AccountAction<AccountActionPayload>>
): AccountState<AccountActionPayload> => {
  const nextState = { ...state };
  switch (action.type) {
    case AccountActionType.ACCOUNT_LOGIN:
      return onAccountLogin(nextState, action as AccountAction<AccountLogin>);
    case AccountActionType.ACCOUNT_LOGOUT:
      return onAccountLogout();
    default:
      return state;
  }
};
