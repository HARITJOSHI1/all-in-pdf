import react from 'react';
import useSWR from 'swr';
import { User } from 'firebase/auth';
import { FormDataUser } from '../actions';
import { AxiosError, AxiosResponse } from 'axios';

interface Props {
  user: User | FormDataUser;
  proute: string;
  refresh: string;
  stopRetries: boolean;
}

interface Result {
  result?: AxiosResponse;
  isloading: boolean;
}

interface RefreshData {
  data?: Result;
  error?: AxiosError;
}

export const useProtectRefresh = <T = any>(props: Props): RefreshData => {
  const { user, proute, refresh, stopRetries } = props;

  const { data: refreshed, error: refreshError } = useSWR<AxiosResponse <T>, AxiosError<T>>(user ? [refresh] : null, {
    refreshInterval: 2,
    shouldRetryOnError: stopRetries,
  });

  const { data: res, error: protectError } = useSWR<AxiosResponse<T>, AxiosError<T>>(
    user && refreshed ? [proute] : null,
    { refreshInterval: 2, shouldRetryOnError: stopRetries }
  );

  if (res) return { data: {result: res, isloading: false} }; 
  else if(protectError) return { error: protectError };
  else if (refreshError) return { error: refreshError };
  else return { data: {result: undefined, isloading: true }};

};
