import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { State, GMQ } from '../reducers';
import { User } from 'firebase/auth';
import { NewUser } from '../actions';
import { useProtectRefresh } from '../hooks/protectRefresh';

interface Props {
  breakpoint: GMQ;
  user: NewUser;
}

const _tools: React.FC<Props> = (props) => {
  const { data: res, error } = useProtectRefresh({
    user: props.user,
    proute: '/api/v1/entry/protect',
    refresh: '/api/v1/token/refresh',
    stopRetries: false,
  });

  if (res && !res.isloading) console.log(res.result);
  else console.log(error);

  return (
    <>
      {!props.user && <div>No user</div>}
      {props.user && res?.isloading && <div>Loading...</div>}
      {props.user && res?.result && (
        <div>{res.result.data.protect}</div>
      )}
      {error && <div>error</div>}
    </>
  );
};

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint as GMQ,
    user: state.user as NewUser,
  };
};

export const Tools = connect(mapStateToProps)(_tools);
