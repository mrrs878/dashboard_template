/*
 * @Author: your name
 * @Date: 2021-02-23 11:21:04
 * @LastEditTime: 2021-02-23 19:23:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/App.tsx
 */
import React, { useReducer } from 'react';
import { Button } from 'antd';
import { reducer, StoreContext } from './store';

function App() {
  const [state, dispatch] = useReducer(reducer, { user: { name: 'zs' } }, undefined);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <header className="App-header">
          <Button type="primary">{ state.user.name }</Button>
        </header>
      </div>
    </StoreContext.Provider>
  );
}

export default App;
