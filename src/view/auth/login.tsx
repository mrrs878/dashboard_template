/*
 * @Author: your name
 * @Date: 2021-04-06 22:37:02
 * @LastEditTime: 2021-04-07 17:53:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\view\auth\login.tsx
 */
import { message } from 'antd';
import React, { useCallback } from 'react';
import MVerify from '../../components/MVerify';

const Login = () => {
  const onSuccess = useCallback(() => {
    message.success('登录成功');
  }, []);
  const onClose = useCallback(() => {
  }, []);
  return (
    <div className="container">
      <MVerify onSuccess={onSuccess} onClose={onClose} />
    </div>
  );
};

export default Login;
