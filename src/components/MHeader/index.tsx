/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 10:26:28
 * @LastEditTime: 2021-04-13 09:46:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/components/MHeader.tsx
 */
import React from 'react';
import { useModel } from '../../store';
import style from './index.module.less';

const MHeader = () => {
  const [user] = useModel('user');
  return (
    <div className={style.container}>
      <div className={style.left} />
      <div className={style.right}>{ user.name }</div>
    </div>
  );
};

export default MHeader;
