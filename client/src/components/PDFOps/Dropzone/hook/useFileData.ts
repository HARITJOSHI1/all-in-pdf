import { createContext, useContext } from "react";
import JSZip from "jszip";

export interface RecievedFileData {
  file: JSZip;
  csize?: number;
  filename: string;
  size: number;
}

// export type KeysEnum<T> = { [P in keyof T]?: true };
// type DynamicKey<T> = keyof T;
// type SelectedRD<T> = {[P in keyof T]: T[P]};

export type FileContextState = RecievedFileData;
export const FileContext = createContext<FileContextState | null>(null);

export const useFileData = (): RecievedFileData => {
  const data = useContext(FileContext)!;
  return data;
};