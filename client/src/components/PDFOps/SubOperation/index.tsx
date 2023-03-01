import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useQuery } from '../../hooks/useQuery';
import { GMQ, State } from '../../reducers';
import { PDFOperations } from '../Operations';
import { useLocation } from 'react-router-dom';
import DeletePages from './DeletePages';
import { Button, Grid, Icon, Stack, Typography, darken } from '@mui/material';
import pdf from './icons/pdf.png';
import { PDFViewer } from '../WebViewer';
import { connect } from 'react-redux';
import * as H from 'history';
import { TextExtractor } from './TextExtractor';

interface MatchParams {
  name: keyof PDFOperations;
}

interface DataFromDropzone {
  allFiles: (File | null)[];
  setAllFiles: React.Dispatch<React.SetStateAction<(File | null)[]>>;
  uploadFilesCb: (
    e?: React.MouseEvent,
    numFiles?: number,
    visitRoute?: boolean
  ) => Promise<void>;
  fd: FormData;
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
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;

  const renderDocIcons = () => {
    return (
      <Stack
        direction={mobile ? 'column' : 'row'}
        justifyContent="center"
        alignItems={(mobile || tabPort) ? 'center' : 'flex-start'}
        flexWrap={mobile ? 'nowrap' : 'wrap'}
        spacing={2}
        sx={{ width: '100%', p: '0 !important' }}
      >
        {state?.allFiles.map((file, idx) => {
          if (file) {
            return (
              <Grid
                item
                key={idx}
                xs= {12}
                sm={2}
                md={3}
                lg= {2}
                sx={{ mb: '2rem !important' }}
              >
                <Stack
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: '100%' }}
                >
                  <Icon
                    sx={{ width: '4rem', height: '4rem', cursor: 'pointer' }}
                    onClick={() => setSelectedFile(file)}
                  >
                    <img src={pdf} alt="pdf" width="100%" height="100%" />
                  </Icon>
                  <Typography
                    component="span"
                    sx={[
                      {
                        display: 'inline-block',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        width: '50%',
                        overflowWrap: 'break-word',
                      },

                      (mobile || tabPort) && { width: '100%' },
                    ]}
                    onClick={() => setSelectedFile(file)}
                  >
                    {file.name}
                  </Typography>
                </Stack>
              </Grid>
            );
          }

          return null;
        })}
      </Stack>
    );
  };
  
  const renderViewer = (file: File) => {
    switch (qParams.get('mode')) {
      
      case 'deletePages':
        console.log("I in delete");
        
        if (state?.allFiles.length)
          return (
            <DeletePages file={file}>
              {(state) => {
                const {
                  removeItemsFromViewer,
                  customizeThumbnails,
                  width,
                  height,
                  pages,
                } = state;
                return (
                  <PDFViewer
                    doc={file}
                    width={width}
                    removeItemsFromViewer={removeItemsFromViewer}
                    customizeThumbnails={customizeThumbnails}
                    height={height}
                  />
                );
              }}
            </DeletePages>
          );

        else return;
      // case 'extract': 
      //   console.log("I am in extract");
      //   return <TextExtractor />
      
      default:
        return <div>Not Allowed</div>;
    }
  };

  const processTheData = () => {
    props.history.goBack();
  };

  return (
    <section>
      <Stack
        direction="column"
        spacing={7}
        alignItems="center"
        sx={{ pt: '3rem' }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: '2rem' }}
        >{`Select the pages of document to ${qParams
          .get('mode')
          ?.toLowerCase()
          .replace('pages', '')}`}</Typography>

        <Grid container sx={{ width: '100%' }}>
          {renderDocIcons()}
        </Grid>

        {selectedFile && renderViewer(selectedFile)}

        <Stack direction="row" justifyContent="center">
          <Button
            onClick={processTheData}
            variant="contained"
            size="large"
            sx={{
              p: '.4rem 6rem',
              mt: "-2rem",
              backgroundColor: '#0055FF',
              textTransform: 'none',
              fontSize: '1.2rem',
              fontWeight: '700',

              '&:hover': {
                backgroundColor: darken('#0055FF', 0.2),
              },
            }}
          >
            Submit
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
