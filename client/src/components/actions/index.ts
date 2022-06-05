import * as Types from "./types";
import { GMQ } from "../reducers";

export interface AdddMediaQ {
  type: Types.Query.mediaQuery;
  payload: Record<keyof GMQ, boolean>
}

export const addGlobalMediaQ = (q: Record<keyof GMQ, boolean>): AdddMediaQ => {
  return {
    type: Types.Query.mediaQuery,
    payload: q,
  };
};
