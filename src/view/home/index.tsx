/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 23:04:18
 * @LastEditTime: 2021-08-16 20:31:58
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: e:\frontEnd\myPro\dashboard_template\src\view\home\index.tsx
 */
import { Button } from 'antd';
import { always, ifElse } from 'ramda';
import React from 'react';
import { useFullScreen, useModel } from '../../store';

const Home = () => {
  const [user, updateUser] = useModel('user');
  const [isFullScreen, fullscreen, exitFullscreen] = useFullScreen();
  return (
    <div style={{ color: '#f00' }}>
      hello &emsp;
      { user.age }
      <Button onClick={() => updateUser({ ...user, age: 32 })}>set user</Button>
      <br />
      <Button onClick={ifElse(always(isFullScreen), exitFullscreen, fullscreen)}>
        {
          isFullScreen ? 'exitFullscreen' : 'fullscreen'
        }
      </Button>
    </div>
  );
};

export default Home;
