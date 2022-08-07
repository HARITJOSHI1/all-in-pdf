import { ListItemAvatar } from '@material-ui/core';
import {
  Card,
  CardContent,
  Icon,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import React from 'react';
import { IconType } from 'react-icons';
import { GMQ } from '../reducers';

export interface PopupBoxList {
  avatar: IconType;
  text: string;
  cb?: () => void;
}

interface Props {
  listArr: PopupBoxList[];
  breakpoint?: GMQ;
}

const PopupBoxListSection = (items: PopupBoxList[]) => {
  return items.map((i) => {
    return (
      <List
        sx={{
          p: 0,
          '&:not(:last-child)': {
            borderBottom: '1px solid #d4d3d2',
          },
        }}
      >
        <ListItem
          sx={{
            textDecoration: 'none',
            transition: 'all .2s',
            p: '1rem',

            '&:hover': {
              backgroundColor: '#d4d6d5',
            },
          }}
          onClick={i?.cb}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Icon
              sx={{
                width: '2rem',
                height: '2rem',
                mr: '.5rem',
              }}
            >
              <i.avatar width="100%" height="100%" />
            </Icon>
            <ListItemText primary={i.text} />
          </Stack>
        </ListItem>
      </List>
    );
  });
};

const PopupBox: React.FC<Props> = (props) => {
  return (
    <Card sx={{ p: 0 }}>
      <CardContent sx={{ p: 0, pb: '0 !important' }}>
        {PopupBoxListSection(props.listArr)}
      </CardContent>
    </Card>
  );
};

export default PopupBox;
