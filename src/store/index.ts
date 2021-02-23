/*
 * @Author: your name
 * @Date: 2021-02-23 18:24:16
 * @LastEditTime: 2021-02-23 23:39:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/store/index.ts
 */

import { createContext, useContext } from 'react';

export interface IUser {
  name: string;
  age: number;
}

interface IState {
  user: IUser;
  addresses?: Array<string>;
}

interface IActions<T extends Actions, P> {
  type: T;
  data: P;
}

enum Actions {
  UPDATE_USER,
  UPDATE_ADDRESSES,
}

type UpdateUser = IActions<Actions.UPDATE_USER, IUser>;
type UpdateAddresses = IActions<Actions.UPDATE_ADDRESSES, Array<string>>;

type Action = UpdateUser|UpdateAddresses;

const StoreContext = createContext<{ state: IState, dispatch: React.Dispatch<Action> }>(
  {
    state: { user: { name: 'tom', age: 21 }, addresses: [] },
    dispatch: () => null,
  },
);

function useUser(): [IUser, (data: IUser) => void] {
  const { state, dispatch } = useContext(StoreContext);
  return [
    state.user,
    (data) => dispatch({ type: Actions.UPDATE_USER, data }),
  ];
}

function useAddresses(): [Array<string>, (data: Array<string>) => void] {
  const { state, dispatch } = useContext(StoreContext);
  return [
    state.addresses || [],
    (data) => dispatch({ type: Actions.UPDATE_ADDRESSES, data }),
  ];
}

function reducer(state: IState, action: Action): IState {
  switch (action.type) {
    case Actions.UPDATE_USER:
      return { ...state, user: action.data };
    case Actions.UPDATE_ADDRESSES:
      return { ...state, addresses: action.data };
    default:
      throw new Error();
  }
}

export {
  reducer, StoreContext, useUser, useAddresses,
};
