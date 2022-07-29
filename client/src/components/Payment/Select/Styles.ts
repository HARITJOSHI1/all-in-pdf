import { StylesConfig } from "react-select";
import { PO } from "./PaymentOpt";

export const customStyles: StylesConfig<PO> = {
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? "#d9d7d7" : "",
    color: state.isSelected ? "#000000" : "",
    ":hover": {
        backgroundColor: "#f0eded"
    }
  }),

  control: (styles, state) => ({
    ...styles,
    padding: "0.5rem"
  })
};
