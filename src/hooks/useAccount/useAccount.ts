import { Dispatch, useReducer, Reducer, useCallback } from "react";
import {
  AccountAction,
  AccountActionPayload,
  AccountState,
  AccountActionType
} from "./models";
import { reducer } from "./reducer";
import { getLocalData } from "./storage";

const initialState = getLocalData();

export function useAccount(): [
  AccountState<AccountActionPayload>,
  Dispatch<AccountAction<AccountActionPayload>>
] {
  const asyncReducer = useCallback(
    (
      state: AccountState<AccountActionPayload>,
      action: AccountAction<AccountActionPayload>
    ): AccountState<AccountActionPayload> => reducer(state, action, dispatch),
    []
  );

  const [state, dispatch] = useReducer<
    Reducer<
      AccountState<AccountActionPayload>,
      AccountAction<AccountActionPayload>
    >
  >(asyncReducer, initialState);

  return [state, dispatch];
}

// simulate account login
export const accountLogin = (
  username: string,
  password: string,
  dispatch: Dispatch<AccountAction<AccountActionPayload>>
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const valid = password === "password";
      dispatch({
        type: AccountActionType.ACCOUNT_LOGIN,
        payload: {
          username: valid ? username : undefined
        }
      });
      valid
        ? resolve()
        : reject({
            error: "INCORRECT_PASSWORD"
          });
    }, 1000);
  });
};

export const accountLogout = (
  dispatch: Dispatch<AccountAction<AccountActionPayload>>
) => {
  dispatch({
    type: AccountActionType.ACCOUNT_LOGOUT
  });
};
