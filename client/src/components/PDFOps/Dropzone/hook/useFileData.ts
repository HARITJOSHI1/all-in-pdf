import { createContext, useContext } from "react";
import JSZip from "jszip";

export interface RecievedFileData {
  file: JSZip;
  csize?: number;
  filename: string;
  length: number;
  path:
    | "compress"
    | "merge"
    | "encrypt"
    | "word-to-pdf"
    | "pdf-to-word"
    | "ppt-to-pdf"
    | "pdf-to-ppt"
    | "split";
}

// export type KeysEnum<T> = { [P in keyof T]?: true };
// type DynamicKey<T> = keyof T;
// type SelectedRD<T> = {[P in keyof T]: T[P]};

export type FileContextState = RecievedFileData[];
export const FileContext = createContext<FileContextState | null>(null);

export const useFileData = (): RecievedFileData => {

  const path = window.location.pathname.split("/").pop() as string;
  const Files = useContext(FileContext)!;
  const data = Files.find((p) => p.path.match(path))!;
  
  return data;
};