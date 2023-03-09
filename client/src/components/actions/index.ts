import * as Types from './types';
import { GMQ } from '../reducers';

export interface AddMediaQ {
  type: Types.Query.mediaQuery;
  payload: Record<keyof GMQ, boolean>;
}

export interface UserData {
  type: Types.User.user;
  payload: NewUser | null;
}

export type FormDataUser = {
  email: string | null;
  password: string | null;
};

export interface NewUser {
  id: string;
  name: string;
  email: string;
  profilePic: string;
  type: 'signed' | 'trial' | 'premium' | 'anonymous';
  filesWorked: number;
  filesDownloaded: number;
  password: string;
  passCreatedAt: Date;
  verifyEmail: string;
  verifyEmailExp: Date;
  emailVerified: boolean;
  phoneNoVerified: boolean;
  location?: string;
  message?: string;
}

export const addGlobalMediaQ = (q: Record<keyof GMQ, boolean>): AddMediaQ => {
  return {
    type: Types.Query.mediaQuery,
    payload: q,
  };
};

export const addGlobalUser = (data: NewUser | null): UserData => {
  return {
    type: Types.User.user,
    payload: data,
  };
};
