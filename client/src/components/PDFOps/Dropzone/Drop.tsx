import { Button, Grid, Icon, Stack, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import axios, { AxiosResponse } from "axios";
import UploadLoader from "./UploadLoader";
import UploadBtn from "./PDFBtn";
import { GMQ } from "../../reducers";
import Result from "./Result/Result";
import { AiOutlineFileAdd } from "react-icons/ai";
import {OPERATIONS, PDFOperations} from "../Operations";

interface Props {
  breakpoint: GMQ;
  param: keyof PDFOperations;
}

export default function Drop(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  const {param} = props;
  const endPoint = param.split("-")[0];

  const obj = OPERATIONS[param];

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },

    maxFiles: 10,
  });

  const [allFiles, setAllFiles] = useState<File[]>([]);
  const [isUpload, setUpload] = useState<boolean>(false);
  const [isUploaded, setUploaded] = useState<boolean>(false);
  const [percentUploaded, setPercentUploaded] = useState<number>(0);
  const [response, setResponse] = useState<AxiosResponse | null>(null);

  // useEffect(() => {
  //   console.log("I am here");
  //   setAllFiles([]);
  // }, [props]);

  useEffect(() => {
    if (acceptedFiles.length) setAllFiles([...allFiles, ...acceptedFiles]);
  }, [acceptedFiles.length]);

  const numFiles = allFiles.length;

  const uploadFiles = async (e?: React.MouseEvent, numFiles?: number) => {
    if (numFiles && e !== undefined) {
      e.stopPropagation();
      try {
        setUpload(true);
        const fd = new FormData();
        allFiles.map((file: File) => fd.append("files", file));

        const res = await axios.post(
          `/api/v1/pdf/${endPoint}`,
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },

            onUploadProgress: (progress) => {
              setPercentUploaded(
                Math.round(progress.loaded / progress.total) * 100
              );
            },
          }
        );

        if (res.data) {
          console.log(res.data);
          setResponse(res);
          setUpload(false);
          setUploaded(true);
          setAllFiles([]);
        }
      } catch (err: any) {
        console.log(err?.response.data || err.message);
        const { message } = err?.response?.data
          ? err.response.data
          : { message: "Something went wrong" };

        setUpload(false);
        setAllFiles([]);
      }
    }
  };

  return (
    <Stack>
      <Grid container sx={{ background: obj.bgColor }}>
        {!isUploaded && (
          <Grid
            {...getRootProps({ className: 'dropzone' })}
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            sx={{
              border: obj.border,
              background: obj.bgDark,
              borderRadius: '3px',
              m: '.9rem',
              height: '100%',
              cursor: 'pointer',
              py: '4rem',
            }}
          >
            <input {...getInputProps()} />
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
            >
              {isUpload ? (
                <UploadLoader percentUploaded={percentUploaded} />
              ) : (
                <>
                  <Icon sx={{ width: '5rem', height: '5rem', color: 'white' }}>
                    <BackupTableIcon sx={{ width: '100%', height: '100%' }} />
                  </Icon>

                  <UploadBtn
                    fn={uploadFiles}
                    numFiles={numFiles}
                    sx={[
                      {
                        width: '20%',
                      },
                      tabPort && { width: '40%' },
                      tabLand && { width: '40%' },
                      mobile && { width: '70%' },
                    ]}
                    isConn
                    IconForBtn={AiOutlineFileAdd}
                  />
                </>
              )}

              {!isUpload && (
                <span style={{ color: 'white' }}>or drop your files</span>
              )}
            </Stack>
          </Grid>
        )}

        {/* {response as RecievedFileData}         */}

        {isUploaded && (
            <Result breakpoint={props.breakpoint} response = {response as AxiosResponse}/>
        )}
      </Grid>
    </Stack>
  );
}
