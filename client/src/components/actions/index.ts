import * as Types from "./types";
import { GMQ } from "../reducers";
import { User } from "firebase/auth";

export interface AdddMediaQ {
  type: Types.Query.mediaQuery;
  payload: Record<keyof GMQ, boolean>
}

export interface UserData {
  type: Types.User.user;
  payload: User;
}

export const addGlobalMediaQ = (q: Record<keyof GMQ, boolean>): AdddMediaQ => {
  return {
    type: Types.Query.mediaQuery,
    payload: q,
  };
};

export const addGlobalUser = (data: User): UserData => {
  return {
    type: Types.User.user,
    payload: data,
  };
};