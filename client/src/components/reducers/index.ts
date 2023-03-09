import { UserData, FormDataUser, NewUser, AddMediaQ } from './../actions/index';
import { combineReducers } from "redux";
import * as Types from "../actions/types";
// eslint-disable-next-line import/no-anonymous-default-export

export interface GMQ {
  mobile: boolean;
  tabPort: boolean;
  tabLand: boolean;
  desktop: boolean;
}

export interface State {
  breakpoint: GMQ | null;
  user: NewUser | null;
}

const globalMedia: GMQ = {
  mobile: false,
  tabPort: false,
  tabLand: false,
  desktop: false,
};


const mediaQueryReducer = (state = {}, action: AddMediaQ) => {
  switch (action.type) {
    case Types.Query.mediaQuery:
      const mediaKey = Object.keys(action.payload)[0] as keyof GMQ;
      return Object.assign({ ...globalMedia }, { [mediaKey]: true });

    default:
      return state;
  }
};

const globalUserReducer = (state = null, action: UserData) => {
  switch (action.type) {
    case Types.User.user:
      return action.payload

    default:
      return state;
  }
}

export default combineReducers ({
  breakpoint: mediaQueryReducer,
  user: globalUserReducer,
});
