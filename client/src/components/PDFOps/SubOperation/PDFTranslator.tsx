import React, { Component } from "react";
import { Box, Grid, Icon, Stack } from "@mui/material";
import WebViewer, { Instance } from "pspdfkit";
import { PDFViewer } from "../WebViewer";
import axios from "axios";
import languages from "./languages";
import { GMQ } from "../../reducers";
import TranslateIcon from "@mui/icons-material/Translate";
import { LangSelector } from "./LangSelector";

interface Props {
  file: File;
  breakpoints: GMQ;
}

interface State {
  lang_detected: string | null;
}

interface APIResponse {
  status: string;
  data: Data;
}

interface Data {
  file: string;
  mimetype: string;
  detection: Detection[];
}

interface Detection {
  language: string;
  score: number;
  isTranslationSupported: boolean;
  isTransliterationSupported: boolean;
}

interface QueryResponse extends APIResponse {}

export default class PDFTranslator extends Component<Props, State> {
  state: State = {
    lang_detected: null,
  };

  componentDidMount(): void {
    this.autoDetectLang()
      .then(({ data }) => {
        const { name: langName } = languages.find(
          ({ code }) => code === data.data.detection[0].language
        )!;
        this.setState({ lang_detected: langName });
      })
      .catch((err) => console.log(err));
  }

  autoDetectLang = async () => {
    const fd = new FormData();
    fd.set("files", this.props.file);
    const res = await axios.post<QueryResponse>(`/api/v1/pdf/lang_detect`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return res;
  };

  initialPDFViewerSetup = (instance: Instance) => {
    instance.setViewState((viewState) =>
      viewState.set("zoom", WebViewer.ZoomMode.AUTO)
    );
  };

  removeItemsFromViewer = (instance: Instance) => {
    this.initialPDFViewerSetup(instance);
    const items = instance.toolbarItems;
    instance.setToolbarItems(
      items.filter(
        (item) =>
          item.type !== "ink" &&
          item.type !== "annotate" &&
          item.type !== "highlighter" &&
          item.type !== "search" &&
          item.type !== "comment" &&
          item.type !== "text" &&
          item.type !== "document-editor" &&
          item.type !== "note" &&
          item.type !== "text-highlighter" &&
          item.type !== "document-crop" &&
          item.type !== "dashed-ellipse" &&
          item.type !== "ink-eraser" &&
          item.type !== "image" &&
          item.type !== "line" &&
          item.type !== "stamp" &&
          item.type !== "signature" &&
          item.type !== "arrow" &&
          item.type !== "rectangle" &&
          item.type !== "ellipse" &&
          item.type !== "polygon" &&
          item.type !== "cloudy-ellipse" &&
          item.type !== "cloudy-rectangle" &&
          item.type !== "polyline" &&
          item.type !== "cloudy-polygon"
      )
    );
  };

  render(): React.ReactNode {
    const { lang_detected } = this.state;
    const { mobile, tabLand, tabPort } = this.props.breakpoints;
    return (
      <section style={{ width: "97%" }}>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack direction="column" spacing={2}>
              <Stack
                alignItems="center"
                justifyContent="center"
                direction="row"
                sx={[
                  {
                    width: "30%",
                    bgcolor: "#e8e6e6",
                    border: "1.5px black",
                    borderRadius: "4px",
                    textAlign: "center",
                    color: "#414141",
                  },

                  (tabLand || tabPort) && { width: "50%" },
                  mobile && { width: "100%" },
                ]}
              >
                <TranslateIcon sx={{ width: "20px", height: "20px" }} />: {"  "}
                <span>{!lang_detected ? "Detecting..." : lang_detected}</span>
              </Stack>

              <Box >
                <PDFViewer
                  doc={this.props.file!}
                  width="100%"
                  removeItemsFromViewer={this.removeItemsFromViewer}
                  height="100vh"
                />
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack sx={{ bgcolor: "#95d4f0", height: "100%" }}>
              <LangSelector />
            </Stack>
          </Grid>
        </Grid>
      </section>
    );
  }
}
