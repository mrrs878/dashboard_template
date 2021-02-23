/*
 * @Author: your name
 * @Date: 2021-02-23 18:24:16
 * @LastEditTime: 2021-02-23 19:22:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/store/index.ts
 */

import { createContext } from 'react';

interface IUser {
  name: string;
  age: number;
}

const StoreContext = createContext<{ state: { user: IUser }, dispatch: React.Dispatch<any> }>({ state: { user: { name: 'tom', age: 21 } }, dispatch: () => null });

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'updateUser':
      return { user: { ...state, user: action.data } };
    default:
      throw new Error();
  }
}

export { reducer, StoreContext };
