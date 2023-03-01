import React, {useState, useEffect} from 'react';
import { GMQ, State } from '../reducers';
import Drop from './Dropzone/Drop';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { PDFOperations, OPERATIONS } from './Operations';
import { Grid, Icon, Stack, Typography } from '@mui/material';
import StarRatings from 'react-star-ratings';

interface MatchParams {
  name: keyof PDFOperations;
}

interface Props extends RouteComponentProps<MatchParams> {
  breakpoint: GMQ;
}

interface FileContextState {
  remoteFiles: (File | null)[];
  setFiles: React.Dispatch<React.SetStateAction<(File | null)[]>>;
}

interface RemoteFileUploadContextState {
  isRemoteFileUpload: boolean;
  setRemoteFileLoad: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UploadPercentageState {
  percentUploaded: number;
  setPercentUploaded: React.Dispatch<React.SetStateAction<number>>;
}

type RemoteFileContextStore = [
  FileContextState,
  RemoteFileUploadContextState,
  UploadPercentageState
];

export const FileContextStore = React.createContext<RemoteFileContextStore>([
  {
    remoteFiles: [],
    setFiles: () => {},
  },
  { isRemoteFileUpload: false, setRemoteFileLoad: () => {} },
  { percentUploaded: 0, setPercentUploaded: () => {} },
]);

function _Operation(props: Props) {
  const PARAM = props.match.params.name;
  const history = props.history;
  const obj = OPERATIONS[PARAM];
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  const [rating, setRating] = useState<number>(0);
  const [remoteFiles, setFiles] = useState<(File | null)[]>([]);
  const [isRemoteFileUpload, setRemoteFileLoad] = useState(false);
  const [percentUploaded, setPercentUploaded] = useState<number>(0);

  const RemoteFileContextVal: RemoteFileContextStore = [
    { remoteFiles, setFiles },
    { isRemoteFileUpload, setRemoteFileLoad },
    { percentUploaded, setPercentUploaded },
  ];

  useEffect(() => {
    return () => {
      setRating(0);
    };
  }, [props]);

  const GenerateDes = () => {
    return (
      <>
        {obj.longDes.map((d, idx) => {
          return (
            <Grid key={idx} item xs={12} sm={12} md={12} lg={4}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={3}
              >
                <Icon sx={{ width: '4rem', height: '4rem' }}>
                  <d.icon
                    style={{ width: '100%', height: '100%' }}
                    color="#5f4278"
                  />
                </Icon>

                <Typography
                  component="p"
                  sx={[
                    {
                      px: '2rem',
                      width: '80%',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    tabLand && { width: '75%' },
                    tabPort && { width: '70%' },
                    mobile && { width: '100%' },
                  ]}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      fontWeight: '600',
                      marginBottom: '1rem',
                    }}
                  >
                    {d.head}
                  </span>
                  <span style={{ display: 'inline-block', fontSize: '.95rem' }}>
                    {d.des}
                  </span>
                </Typography>
              </Stack>
            </Grid>
          );
        })}
      </>
    );
  };

  return (
    <>
      <section>
        <Stack direction="row" justifyContent="center" sx={{ py: '4rem' }}>
          <Typography variant="h3">{obj.name}</Typography>
        </Stack>
      </section>

      <section>
        <FileContextStore.Provider value={RemoteFileContextVal}>
          <Drop
            breakpoint={props.breakpoint}
            param={PARAM}
            history={history}
            operation={obj}
          />
        </FileContextStore.Provider>
      </section>

      <section style={{ paddingTop: '8rem' }}>
        <Grid
          container
          spacing={4}
          sx={[
            { px: '4rem' },
            tabPort && { px: '2rem' },
            mobile && { px: '0' },
          ]}
        >
          <GenerateDes />
        </Grid>
      </section>

      <section>
        <Stack
          direction="column"
          alignItems="center"
          spacing={4}
          sx={{ py: '5rem' }}
        >
          <Typography variant="h5" sx={{ fontWeight: '700' }}>
            Give us your ratings!
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <StarRatings
              rating={rating}
              starRatedColor="#ebc56c"
              changeRating={(r) => {
                if (!rating) setRating(r);
                else setRating(rating);
              }}
              starHoverColor="#ebc56c"
              starSpacing="3px"
              numberOfStars={5}
              name={String(rating)}
              starDimension="1.3rem"
            />
            <Typography component="span">{`${rating} / 5`}</Typography>
          </Stack>
        </Stack>
      </section>
    </>
  );
}

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint as GMQ,
  };
};

export default connect(mapStateToProps)(_Operation);
