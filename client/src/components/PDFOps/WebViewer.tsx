import React, { useEffect, useRef } from "react";
import WebViewer, { Instance } from "pspdfkit";
import { useQuery } from "../hooks/useQuery";

interface ViewerProps {
  doc: File;
  width: string;
  height: string;
  removeItemsFromViewer?: (instance: Instance) => void;
  customizeThumbnails?: (containerNode: Node) => void;
}

export const PDFViewer: React.FC<ViewerProps> = (props) => {
  const viewer = useRef<HTMLDivElement>(null);
  const qParams = useQuery();

  useEffect(() => {
    const container = viewer.current!;
    (async function () {
      const instance = await WebViewer.load({
        container,
        document: await props.doc.arrayBuffer(),
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,

        initialViewState: new WebViewer.ViewState({
          zoom: 1.5,
        }),

        customUI: {
          [WebViewer.UIElement.Sidebar]: {
            [WebViewer.SidebarMode.THUMBNAILS]({ containerNode }) {
              if (qParams.get("mode") !== "deletePages")
                return { node: containerNode };
              return {
                node: containerNode,
                onRenderItem() {
                  switch (qParams.get("mode")) {
                    case "deletePages":
                      props.customizeThumbnails!(containerNode);
                      break;
                  }
                },
              };
            },
          },
        },
      });

      switch (qParams.get("mode")) {
        case "deletePages":
          props.removeItemsFromViewer!(instance);
          break;

        case "translate":
          props.removeItemsFromViewer!(instance);
          break;
      }
    })();

    return () => {
      if (WebViewer) {
        WebViewer.unload(container);
      }
    };
  }, [props.doc?.name]);

  return (
    <>
      <div
        className="webviewer"
        ref={viewer!}
        style={{ width: props.width, height: props.height }}
      ></div>
    </>
  );
};
