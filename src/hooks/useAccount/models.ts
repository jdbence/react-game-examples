export enum AccountActionType {
  ACCOUNT_LOGIN = "ACCOUNT_LOGIN",
  ACCOUNT_LOGOUT = "ACCOUNT_LOGOUT",
  ACCOUNT_CREATE = "ACCOUNT_CREATE"
}

export interface AccountAction<T> {
  type: AccountActionType;
  payload?: T;
}

export type AccountActionPayload = AccountLogin | AccountCreate;

export interface AccountLogin {
  username?: String;
}

export interface AccountCreate {
  username: String;
}

export interface AccountState<T> {
  username?: String;
  isLoggedIn: boolean;
}
