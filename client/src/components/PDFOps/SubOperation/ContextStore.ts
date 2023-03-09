import React, { createContext } from "react";
import { SubTypes } from "./subTypes/types";
// type InferDataType<T> = T extends any ? E : T;
export type LangStateData = {
  type: SubTypes;
  value: string | null;
};

interface LangSelectState {
  data: LangStateData;
  setData: React.Dispatch<React.SetStateAction<LangStateData>>;
}

export type SubOpState = [LangSelectState];
export const DataStore = createContext<SubOpState>([
  {
    data: {
      type: SubTypes.LANG_SELECT,
      value: null,
    },

    setData: () => {},
  },
]);
