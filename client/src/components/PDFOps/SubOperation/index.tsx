import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import { GMQ, State } from "../../reducers";
import { PDFOperations } from "../Operations";
import { useLocation } from "react-router-dom";
import DeletePages from "./DeletePages";
import { Button, Grid, Icon, Stack, Typography, darken } from "@mui/material";
import { PDFViewer } from "../WebViewer";
import { connect } from "react-redux";
import * as H from "history";
import { LangSelector } from "./LangSelector";
import { RenderDocIcons } from "./RenderIcons";
import { DataStore, LangStateData, SubOpState } from "./ContextStore";
import * as Types from "./subTypes/types";
import PDFTranslator from "./PDFTranslator";

interface MatchParams {
  name: keyof PDFOperations;
}

export interface DataFromDropzone {
  allFiles: (File | null)[];
}

interface Props extends RouteComponentProps<MatchParams> {
  breakpoint: GMQ;
  history: H.History;
}

function SubOperation(props: Props) {
  const qParams = useQuery();
  const location = useLocation<DataFromDropzone>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const state = location.state;
  const allFiles = state.allFiles;
  const [langSelect, setLangSelectData] = useState<LangStateData>({
    type: Types.SubTypes.DEFAULT,
    value: null,
  });

  const renderViewer = () => {
    switch (qParams.get("mode")) {
      case "deletePages":
        if (state?.allFiles.length)
          return (
            <>
              <Typography variant="h2" sx={{ fontSize: "2rem" }}>
                Select the pdf file to delete
              </Typography>

              <Grid container sx={{ width: "100%" }}>
                <RenderDocIcons
                  breakpoints={props.breakpoint}
                  state={state}
                  setSelectedFile={setSelectedFile}
                />
              </Grid>

              <DeletePages file={selectedFile!}>
                {(state) => {
                  const {
                    removeItemsFromViewer,
                    customizeThumbnails,
                    width,
                    height,
                  } = state;
                  return selectedFile ? (
                    <PDFViewer
                      doc={selectedFile!}
                      width={width}
                      removeItemsFromViewer={removeItemsFromViewer}
                      customizeThumbnails={customizeThumbnails}
                      height={height}
                    />
                  ) : null;
                }}
              </DeletePages>
            </>
          );
        else return;
      case "ocr":
        if (langSelect.type === Types.SubTypes.DEFAULT)
          setLangSelectData({ type: Types.SubTypes.LANG_SELECT, value: null });
        return <LangSelector />;

      case "translate":
        return (
          <PDFTranslator file={allFiles[0]!} breakpoints={props.breakpoint} />
        );

      default:
        return <div>Not Allowed</div>;
    }
  };

  const processTheData = (contextState: SubOpState) => {
    contextState.forEach((store) => {
      switch (store.data.type) {
        case Types.SubTypes.LANG_SELECT:
          props.history.push({
            pathname: `/operation/ocr-pdf`,
            state: {
              allFiles,
              dataFrmRoute: JSON.stringify(store),
              forwarded: true,
            },
          });
          break;

        default:
          break;
      }
    });
  };

  const Store: SubOpState = [
    {
      data: langSelect,
      setData: setLangSelectData,
    },
  ];

  return (
    <section>
      <Stack
        direction="column"
        spacing={7}
        alignItems="center"
        sx={{ pt: "3rem" }}
      >
        <DataStore.Provider value={Store}>{renderViewer()}</DataStore.Provider>
        <Stack direction="row" justifyContent="center">
          <Button
            onClick={processTheData.bind(null, Store)}
            variant="contained"
            size="large"
            sx={{
              p: ".4rem 6rem",
              mt: "-2rem",
              backgroundColor: "#0055FF",
              textTransform: "none",
              fontSize: "1.2rem",
              fontWeight: "700",

              "&:hover": {
                backgroundColor: darken("#0055FF", 0.2),
              },
            }}
          >
            Done
          </Button>
        </Stack>
      </Stack>
    </section>
  );
}

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint!,
  };
};

export default connect(mapStateToProps)(SubOperation);
