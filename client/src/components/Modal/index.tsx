import { Stack } from "@mui/material";
import React, { ReactNode, useContext, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { Context } from "../Layout";
import { GMQ } from "../reducers";

interface Props {
  breakpoint: GMQ;
  children: ReactNode;
}

export default function Index(props: Props) {
  const { showModal, setModal } = useContext(Context)[1];
  const { setLogin } = useContext(Context)[3];

  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;

  useLayoutEffect(() => {
    const root = document.getElementById("root") as HTMLDivElement;
    const modal = document.getElementById("modal") as HTMLDivElement;

    const removeModal = (e: MouseEvent): any => {
      const element = e.target as HTMLElement;
      if (element.closest("#modal-close")) return;
      setModal(false);
    };

    if (showModal) {
      root.style.transition = "ease-in 0.6s";
      modal.style.transition = "ease-in 0.6s";
      root.style.filter = "blur(12px)";
      modal.style.visibility = "visible";
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      document.body.addEventListener("click", removeModal, true);
    } else {
      root.style.filter = "blur(0px)";
    }

    return () => {
      root.style.filter = "blur(0px)";
      modal.style.visibility = "hidden";
      document.body.removeEventListener("click", removeModal, true);
      setLogin(false);
    };
  }, [showModal]);

  return ReactDOM.createPortal(
    <>
      <div
        style={{
          position: "fixed",
          transition: "ease-in 0.6s",
          width: "100%",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          backgroundColor: "#000000",
          opacity: ".5",
          zIndex: "10000",
        }}
      ></div>{" "}
      <Stack
        id="modal-close"
        sx={[
          {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "85%",
            aspectRatio: "16/9",
          },
          tabLand && { height: "80%" },
          (tabPort || mobile) && { width: "100%", height: "90%" },
        ]}
      >
        {props.children}
      </Stack>
    </>,
    document.getElementById("modal") as Element
  );
}
