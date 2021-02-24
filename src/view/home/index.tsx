/*
 * @Author: your name
 * @Date: 2021-02-24 23:04:18
 * @LastEditTime: 2021-02-24 23:14:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \components_library\src\view\home\index.tsx
 */
import React from 'react';
import { useModel } from '../../store';

const Home = () => {
  const user = useModel('fullScreen');
  return (
    <div style={{ color: '#f00' }}>
      hello &emsp;
      { user?.toString() }
    </div>
  );
};

export default Home;
