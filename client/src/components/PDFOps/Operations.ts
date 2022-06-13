import { MdCompress, MdDownloadDone } from "react-icons/md";
import {AiOutlineFileWord} from "react-icons/ai";
import {AiOutlineFilePdf} from "react-icons/ai";
import {AiOutlineFileJpg} from "react-icons/ai";
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
      head: string;
      des: string;
    }[];
  }
>;

export const OPERATIONS: PDFOperations = {
  "word-pdf": {
    bgColor: "#4867f0",
    bgDark: "#3a4ea6",
    border: "2px dashed #051c80",
    name: "Word to PDF",
    icon: Word,
    des: "Covert PDF into Word files easily",

    longDes: [
      {
        icon: AiOutlineFileWord,
        head: "Add files",
        des: "Just drag-and-drop your PDF file in the box above, wait for the conversion to complete and download your file. It's that simple.",
      },

      {
        icon: FiLoader,
        head: "Wait for process",
        des: "You just have to sit and relax and it will take a few seconds for our conversion tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        head: "Work done",
        des: "Yozwa!! Your word files are successfully converted to pdf's which are perfect for uploading files to the web and through email.",
      },
    ],
  },

  "merge-pdf": {
    bgColor: "#8c5ae0",
    bgDark: "#614394",
    border: "2px dashed #3b098f",
    name: "Merge PDF",
    icon: Merge,
    des: "Merge multiple PDF's into one",

    longDes: [
      {
        icon: AiOutlineFilePdf,
        head: "Add files",
        des: "Just drag-and-drop your PDF file in the box above, wait for the merging of pdf's to complete and download your file. It's that simple.",
      },

      {
        icon: FiLoader,
        head: "Wait for process",
        des: "You just have to sit and relax and it will take a few seconds for our merging tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        head: "Work done",
        des: "Yozwa!! Your pdf's are successfully merged which are perfect for uploading files to the web and through email.",
      },
    ],
  },

  "jpg-pdf": {
    bgColor: "#d2d95b",
    bgDark: "#8a8f3b",
    border: "2px dashed #616605",
    name: "JPG to PDF",
    icon: Jpg,
    des: "Transform JPG and PNG images to PDF",

    longDes: [
      {
        icon: AiOutlineFileJpg,
        head: "Add files",
        des: "Just drag-and-drop your PDF file in the box above, wait for the conversion to complete and download your file. It's that simple.",
      },

      {
        icon: FiLoader,
        head: "Wait for process",
        des: "You just have to sit and relax and it will take a few seconds for our conversion tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        head: "Work done",
        des: "Yozwa!! Your images are successfully converted to pdf's which are perfect for uploading files to the web and through email.",
      },
    ],
  },

  "esign-pdf": {
    bgColor: "#c960e6",
    bgDark: "#874699",
    border: "2px dashed #660303",
    name: "Esign PDF",
    icon: eSign,
    des: "Create your signature and sign multiple PDF's",

    longDes: [
      {
        icon: AiOutlineFilePdf,
        head: "Add files",
        des: "Just drag-and-drop your PDF file in the box above, and after that upload your sign. It's that simple.",
      },

      {
        icon: FiLoader,
        head: "Wait for process",
        des: "You just have to sit and relax and it will take a few seconds for our signing tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        head: "Work done",
        des: "Yozwa!! Your pdf's are successfully signed which are perfect for uploading files to the web and sharing through emails to clients.",
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
        icon: AiOutlineFilePdf,
        head: "Add files",
        des: "Just drag-and-drop your PDF file in the box above, and go to editor to add shapes and edit your pdf's. It's that simple.",
      },

      {
        icon: FiLoader,
        head: "Wait for process",
        des: "You just have to sit and relax and it will take a few seconds for our editing tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        head: "Work done",
        des: "Yozwa!! Your pdf's are successfully edited which are perfect for uploading files to the web and through email.",
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
        icon: AiOutlineFilePdf,
        head: "Add files",
        des: "Just drag-and-drop your PDF file in the box above, wait for the compression to complete and download your file. It's that simple.",
      },

      {
        icon: FiLoader,
        head: "Wait for process",
        des: "You just have to sit and relax and it will take a few seconds for our compression tool to work its magic.",
      },

      {
        icon: MdDownloadDone,
        head: "Work done",
        des: "Yozwa!! Your pdf's are successfully compressed which are perfect for uploading files to the web and through email.",
      },
    ],
  },
};
