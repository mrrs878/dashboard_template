/*
 * @Author: your name
 * @Date: 2021-02-23 11:21:04
 * @LastEditTime: 2021-02-26 15:06:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/App.tsx
 */
import React, { useReducer } from 'react';
import MLayout from './layout';
import { defaultState, reducer, StoreContext } from './store';

function App() {
  const [state, dispatch] = useReducer(reducer, defaultState, undefined);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <MLayout />
    </StoreContext.Provider>
  );
}

export default App;
