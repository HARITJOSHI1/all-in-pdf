import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { SxProps } from '@mui/material/styles';
import { Context } from '../Layout';
import EntryForm from '../Entry/EntryForm';
import SignUp from '../Entry/SignUp';
import { GMQ } from '../reducers';

interface Props {
  text: string;
  sx: SxProps;
  breakpoint: GMQ;
}

const Btn: React.FC<Props> = function Btn({ sx, text, breakpoint }) {
  const { showModal, setModal } = useContext(Context)[1];
  return (
    <Button
      size="medium"
      sx={[{ whiteSpace: 'nowrap' }, ...(Array.isArray(sx) ? sx : [sx])]}
      onClick={() => {
        setModal({
          show: true,
          fn: () => {
            return (
              <SignUp>
                <EntryForm
                  breakpoint={breakpoint}
                  num={3}
                />
              </SignUp>
            );
          },
        });
      }}
    >
      {text}
    </Button>
  );
};

export default Btn;
