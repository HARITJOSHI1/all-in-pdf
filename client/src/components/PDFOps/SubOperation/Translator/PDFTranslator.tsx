import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Icon, Stack, List, CircularProgress } from "@mui/material";
import WebViewer, { Instance } from "pspdfkit";
import { PDFViewer } from "../../WebViewer";
import axios from "axios";
import languages from "../utils/Languages";
import { GMQ } from "../../../reducers";
import TranslateIcon from "@mui/icons-material/Translate";
import { LangSelector } from "../utils/LangSelector";
import { DataStore } from "../ContextStore";
import { SubTypes } from "../subTypes/types";
import { TaskButton } from "../utils/Button";
import { Output } from "./Output";
import { BiArrowBack } from "react-icons/bi";
import PDFBtn from "../../Dropzone/PDFBtn";

interface Props {
  file: File;
  breakpoints: GMQ;
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

interface LangDetectQueryResponse extends APIResponse {}

export interface TranslationQueryResponse {
  status: string;
  data: TranlationAPIData;
}

export interface TranlationAPIData {
  file: string;
  mimetype: string;
  output: Output[];
}

export interface Output {
  translations: Translation[];
}

export interface Translation {
  text: string;
  to: string;
}

export const PDFTranslator: React.FC<Props> = (props) => {
  const [lang_detected, setLangDetected] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const subOpStore = useContext(DataStore).find(
    (store) => store.data.type === SubTypes.LANG_SELECT
  )!;

  const { data: selectedLangData } = subOpStore;
  const [translatedText, setTranslatedText] = useState<Translation | null>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    autoDetectLang()
      .then(({ data }) => {
        const lang = languages.find(
          ({ code }) => code === data.data.detection[0].language
        )!;
        setLangDetected(lang);
      })
      .catch((err) => console.log(err));
  });

  const autoDetectLang = async () => {
    const fd = new FormData();
    fd.set("files", props.file);
    const res = await axios.post<LangDetectQueryResponse>(
      `/api/v1/pdf/lang_detect`,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return res;
  };

  const initialPDFViewerSetup = (instance: Instance) => {
    instance.setViewState((viewState) =>
      viewState.set("zoom", WebViewer.ZoomMode.AUTO)
    );
  };

  const removeItemsFromViewer = (instance: Instance) => {
    initialPDFViewerSetup(instance);
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

  const callToTranslate = async () => {
    setLoading(true);
    const from = lang_detected!.code;
    const to = languages.find(
      ({ name }) => name === selectedLangData.value!
    )!.code;

    const fd = new FormData();
    fd.set("files", props.file);

    try {
      const res = await axios.post<TranslationQueryResponse>(
        "/api/v1/pdf/translate",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          params: {
            from,
            to,
          },

          withCredentials: true,
        }
      );

      setTranslatedText(res.data.data.output[0].translations[0]);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const { mobile, tabLand, tabPort } = props.breakpoints;
  return (
    <div style={{ width: "97%" }}>
      <Grid container spacing={8}>
        <Grid item xs={12} sm={12} md={12} lg={6}>
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
              <span>
                {!lang_detected ? "Detecting..." : lang_detected.name}
              </span>
            </Stack>

            <Box>
              <PDFViewer
                doc={props.file!}
                width="100%"
                removeItemsFromViewer={removeItemsFromViewer}
                height="100vh"
              />
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Stack alignItems="center" sx={{ position: "relative" }}>
            {loading && (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  height: "40rem",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: "#DEDDDD !important",
                  opacity: 0.6,
                  zIndex: "1000",
                }}
              >
                <CircularProgress
                  sx={{ width: "4rem !important", height: "4rem !important" }}
                />
                Loading...
              </Stack>
            )}

            <List
              sx={{
                height: "40rem",
                overflowY: "scroll",
                width: "100%",
                ...(loading
                  ? { position: "relative", zIndex: -1, filter: "blur(2px)" }
                  : null),
              }}
            >
              {translatedText ? (
                <Output text={translatedText.text} />
              ) : (
                <LangSelector
                  itemsCount={40}
                  heading="Select the language for translation"
                  selectorWidth="100%"
                  itemFontSize="1rem"
                  itemPadding=".6rem"
                  borderRadius="45px"
                  headingSize="1.5rem"
                  borderType="dashed"
                />
              )}
            </List>

            {translatedText && (
              <PDFBtn
                text="Select new language"
                fn={() => setTranslatedText(null)}
                isConn={false}
                sx={[
                  { width: "100%", mt: "4rem" },
                  (mobile || tabLand) && { width: "80%" },
                  tabPort && { width: "40%" },
                ]}
                IconForBtn={BiArrowBack}
              />
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack direction="row" justifyContent="center">
            <TaskButton<typeof callToTranslate>
              width="20%"
              disable={loading ? true : false}
              task={callToTranslate}
              text="Translate"
            />
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};
