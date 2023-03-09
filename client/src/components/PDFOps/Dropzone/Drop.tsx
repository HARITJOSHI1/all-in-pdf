import { Button, Grid, Icon, Stack, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import axios, { AxiosResponse } from "axios";
import UploadLoader from "./UploadLoader";
import UploadBtn from "./PDFBtn";
import { GMQ } from "../../reducers";
import Result from "./Result/Result";
import { AiOutlineFileAdd } from "react-icons/ai";
import { OPERATIONS, OpKeys, PDFOperations } from "../Operations";
import { FileContextStore } from "../Operation";
import * as H from "history";
import { SubOpState } from "../SubOperation/ContextStore";
import { useLocation } from "react-router-dom";
import * as Types from "../SubOperation/subTypes/types";

type ReturnInTupleType<T> = T extends Array<infer E> ? E : any;

interface Props {
  breakpoint: GMQ;
  param: keyof PDFOperations;
  operation: PDFOperations[OpKeys];
  history: H.History;
}

interface DataFromRoute {
  allFiles: (File | null)[];
  dataFrmRoute: string;
  forwarded: boolean;
}

const MAXFILES = 10;

export default function Drop(props: Props) {
  const { state } = useLocation<DataFromRoute | undefined>();
  const [routeState, setRouteState] = useState<DataFromRoute | undefined>(
    state
  );
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  const { param, history, operation } = props;
  const endPoint = param.split("-")[0];
  const obj = OPERATIONS[param];
  const [btntxt, setBtntxt] = useState<string>("Choose files");
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },

    maxFiles: MAXFILES,
    onError: (e) => console.log(e),
    useFsAccessApi: false,
  });

  const [allFiles, setAllFiles] = useState<(File | null)[]>([]);
  const [isUpload, setUpload] = useState<boolean>(false);
  const [isUploaded, setUploaded] = useState<boolean>(false);
  const [response, setResponse] = useState<AxiosResponse | null>(null);
  const { remoteFiles, setFiles } = useContext(FileContextStore)[0];
  const { isRemoteFileUpload } = useContext(FileContextStore)[1];
  const [files, setAcceptedFiles] = useState<(File | null)[]>([]);
  const [queryParams, setQueryParams] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (routeState?.dataFrmRoute) {
      const frmRoute = JSON.parse(
        routeState.dataFrmRoute
      ) as ReturnInTupleType<SubOpState>;

      switch (frmRoute.data?.type) {
        case Types.SubTypes.LANG_SELECT:
          setAllFiles(routeState.allFiles);
          setBtntxt("Upload");
          setQueryParams({ lang: frmRoute.data.value! });
          break;
      }
    }

    return () => {
      setRouteState(undefined);
    };
  }, []);

  useEffect(() => {
    if (acceptedFiles.length) setAcceptedFiles([...acceptedFiles]);
  }, [acceptedFiles.length]);

  useEffect(() => {
    if (
      (allFiles.length >= operation.capacity ||
        acceptedFiles.length > operation.capacity) &&
      operation.capacity === 1
    )
      return;
    if (
      files.length <= MAXFILES - allFiles.length &&
      remoteFiles.length <= MAXFILES - allFiles.length &&
      allFiles.length <= MAXFILES &&
      (files.length || remoteFiles.length)
    ) {
      if (remoteFiles.length) setAllFiles([...allFiles, ...remoteFiles]);
      else {
        setAllFiles([...allFiles, ...files]);
        if (param.includes("ocr")) setBtntxt("Select language");
        else setBtntxt("Upload");
      }
    }

    setAcceptedFiles([]);
    setFiles([]);
  }, [files.length, remoteFiles.length]);

  const numFiles = allFiles.length;

  const uploadFiles = async (e?: React.MouseEvent, numFiles?: number) => {
    if (numFiles && e !== undefined) {
      e.stopPropagation();

      try {
        if (operation.route && !routeState?.forwarded) {
          history.push({
            pathname: operation.route,
            search: `?mode=${endPoint}`,
            state: {
              allFiles,
            },
          });

          return;
        }

        setUpload(true);
        const fd = new FormData();
        allFiles.map((file) => fd.append("files", file!));
        const res = await axios.post(`/api/v1/pdf/${endPoint}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          params: {
            ...queryParams,
          },
          withCredentials: true,
        });

        if (res.data) {
          console.log("Response from the pdf operations server: ", res.data);
          setResponse(res);
          setUpload(false);
          setUploaded(true);
          setAllFiles([]);
          setBtntxt("Choose files");
        }
      } catch (err: any) {
        console.log(err?.response?.data || err.message);
        const { message } = err?.response?.data
          ? err.response.data
          : { message: "Something went wrong" };

        setUpload(false);
        setAllFiles([]);
        setBtntxt("Choose files");
        setRouteState(undefined);
      }
    }
  };

  return (
    <Stack>
      <Grid container sx={{ background: obj.bgColor }}>
        {!isUploaded && (
          <Grid
            {...getRootProps({ className: "dropzone" })}
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            sx={{
              border: obj.border,
              background: obj.bgDark,
              borderRadius: "3px",
              m: ".9rem",
              height: "100%",
              cursor: "pointer",
              py: "4rem",
            }}
          >
            <input {...getInputProps()} />
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
            >
              {isUpload || isRemoteFileUpload ? (
                <UploadLoader />
              ) : (
                <>
                  <Icon sx={{ width: "5rem", height: "5rem", color: "white" }}>
                    <BackupTableIcon sx={{ width: "100%", height: "100%" }} />
                  </Icon>

                  <UploadBtn
                    fn={uploadFiles}
                    numFiles={numFiles}
                    text={btntxt}
                    sx={[
                      {
                        width: "20%",
                      },
                      tabPort && { width: "40%" },
                      tabLand && { width: "40%" },
                      mobile && { width: "70%" },
                    ]}
                    isConn
                    IconForBtn={AiOutlineFileAdd}
                  />
                </>
              )}

              {!isUpload && (
                <span style={{ color: "white" }}>or drop your files</span>
              )}
            </Stack>
          </Grid>
        )}

        {/* {response as RecievedFileData}         */}

        {isUploaded && (
          <Result
            breakpoint={props.breakpoint}
            response={response as AxiosResponse}
          />
        )}
      </Grid>
    </Stack>
  );
}
