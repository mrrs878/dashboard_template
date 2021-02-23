/*
 * @Author: your name
 * @Date: 2021-02-23 11:21:04
 * @LastEditTime: 2021-02-23 23:40:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/App.tsx
 */
import React, { useCallback, useReducer } from 'react';
import { Button } from 'antd';
import {
  reducer, StoreContext, useAddresses, useUser,
} from './store';

const User = () => {
  const [user, setUser] = useUser();
  const [addresses, setAddresses] = useAddresses();
  const handleUserBtnClick = useCallback(() => {
    setUser({ name: 'ls', age: 21 });
  }, [setUser]);
  const handleAddressBtnClick = useCallback(() => {
    setAddresses(['Shanghai']);
  }, [setAddresses]);
  return (
    <>
      <Button type="primary" onClick={handleUserBtnClick}>{ user.name }</Button>
      <br />
      <br />
      <Button type="primary" onClick={handleAddressBtnClick}>
        address-
        { addresses[0] }
      </Button>
    </>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, { user: { name: 'zs', age: 32 } }, undefined);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <header className="App-header" />
        <User />
      </div>
    </StoreContext.Provider>
  );
}

export default App;
