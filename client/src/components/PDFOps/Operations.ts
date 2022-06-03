import { MdCompress, MdDownloadDone } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import Word from "../tools/icons/word.svg";
import Merge from "../tools/icons/merge.png";
import Jpg from "../tools/icons/JPG.png";
import eSign from "../tools/icons/eSign.png";
import Edit from "../tools/icons/edit.png";
import Compress from "../tools/icons/compress.png";
import { IconType } from "react-icons";

export type OpKeys =
  | "compress-pdf"
  | "word-pdf"
  | "jpg-pdf"
  | "merge-pdf"
  | "esign-pdf"
  | "edit-pdf";

export type PDFOperations = Record<
  OpKeys,
  {
    bgColor: string;
    bgDark: string;
    border: string;
    name: string;
    icon: string;
    des: string;
    longDes: {
      icon: IconType;
      des: string;
    }[];
  }
>;

export const OPERATIONS: PDFOperations = {
  "word-pdf": {
    bgColor: "#f72828",
    bgDark: "#B92525",
    border: "2px dashed #660303",
    name: "Word to PDF",
    icon: Word,
    des: "Covert PDF into Word files easily",

    longDes: [
      {
        icon: MdCompress,
        des: "Just drag-and-drop your PDF file in the box above, wait for the compression to complete and download your file. It's that simple.",
      },

      {
        icon: FiLoader,
        des: "You just have to sit and relax and it will take a few seconds for our compression tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        des: "Yozwa!! Your pdf will successfully be compressed which is perfect for uploading files to the web and through email.",
      },
    ],
  },

  "merge-pdf": {
    bgColor: "#f72828",
    bgDark: "#B92525",
    border: "2px dashed #660303",
    name: "Merge PDF",
    icon: Merge,
    des: "Merge multiple PDF's into one",

    longDes: [
      {
        icon: MdCompress,
        des: "Just drag-and-drop your PDF file in the box above, wait for the compression to complete and download your file. It's that simple.",
      },

      {
        icon: FiLoader,
        des: "You just have to sit and relax and it will take a few seconds for our compression tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        des: "Yozwa!! Your pdf will successfully be compressed which is perfect for uploading files to the web and through email.",
      },
    ],
  },

  "jpg-pdf": {
    bgColor: "#f72828",
    bgDark: "#B92525",
    border: "2px dashed #660303",
    name: "JPG to PDF",
    icon: Jpg,
    des: "Transform JPG and PNG images to PDF",

    longDes: [
      {
        icon: MdCompress,
        des: "Just drag-and-drop your PDF file in the box above, wait for the compression to complete and download your file. It's that simple.",
      },

      {
        icon: FiLoader,
        des: "You just have to sit and relax and it will take a few seconds for our compression tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        des: "Yozwa!! Your pdf will successfully be compressed which is perfect for uploading files to the web and through email.",
      },
    ],
  },

  "esign-pdf": {
    bgColor: "#f72828",
    bgDark: "#B92525",
    border: "2px dashed #660303",
    name: "Esign PDF",
    icon: eSign,
    des: "Create your signature and sign multiple PDF's",

    longDes: [
      {
        icon: MdCompress,
        des: "Just drag-and-drop your PDF file in the box above, wait for the compression to complete and download your file. It's that simple.",
      },

      {
        icon: FiLoader,
        des: "You just have to sit and relax and it will take a few seconds for our compression tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        des: "Yozwa!! Your pdf will successfully be compressed which is perfect for uploading files to the web and through email.",
      },
    ],
  },

  "edit-pdf": {
    bgColor: "#f72828",
    bgDark: "#B92525",
    border: "2px dashed #660303",
    name: "Edit PDF",
    icon: Edit,
    des: "Add shapes, text and images to your PDF's",

    longDes: [
      {
        icon: MdCompress,
        des: "Just drag-and-drop your PDF file in the box above, wait for the compression to complete and download your file. It's that simple.",
      },

      {
        icon: FiLoader,
        des: "You just have to sit and relax and it will take a few seconds for our compression tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        des: "Yozwa!! Your pdf will successfully be compressed which is perfect for uploading files to the web and through email.",
      },
    ],
  },
  "compress-pdf": {
    bgColor: "#f72828",
    bgDark: "#B92525",
    border: "2px dashed #660303",
    name: "Compress PDF",
    icon: Compress,
    des: "Reduce the size of your PDF without loosing quality",

    longDes: [
      {
        icon: MdCompress,
        des: "Just drag-and-drop your PDF file in the box above, wait for the compression to complete and download your file. It's that simple.",
      },

      {
        icon: FiLoader,
        des: "You just have to sit and relax and it will take a few seconds for our compression tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        des: "Yozwa!! Your pdf will successfully be compressed which is perfect for uploading files to the web and through email.",
      },
    ],
  },
};
