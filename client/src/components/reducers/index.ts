import { combineReducers } from "redux";
import * as Types from "../actions/types";
import { AdddMediaQ } from "../actions";
import {reducer as FormReducer} from 'redux-form'
// eslint-disable-next-line import/no-anonymous-default-export

export interface GMQ {
  mobile: boolean;
  tabPort: boolean;
  tabLand: boolean;
  desktop: boolean;
}

export interface State {
  breakpoint: GMQ;
}

const globalMedia: GMQ = {
  mobile: false,
  tabPort: false,
  tabLand: false,
  desktop: false,
};

const mediaQueryReducer = (state: State, action: AdddMediaQ) => {
  switch (action.type) {
    case Types.Query.mediaQuery:
      const mediaKey = Object.keys(action.payload)[0] as keyof GMQ;
      return Object.assign({ ...globalMedia }, { [mediaKey]: true });

    default:
      return globalMedia;
  }
};

export default combineReducers ({
  breakpoint: mediaQueryReducer,
  signUp: FormReducer
});
