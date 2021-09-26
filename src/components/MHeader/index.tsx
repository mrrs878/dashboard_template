/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 10:26:28
 * @LastEditTime: 2021-09-26 21:08:04
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\components\MHeader\index.tsx
 */
import React from 'react';
import { useModel } from 'src/store';
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
