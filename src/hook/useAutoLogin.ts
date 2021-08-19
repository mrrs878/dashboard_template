/* eslint-disable no-underscore-dangle */
/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-11 15:46:49
 * @LastEditTime: 2021-08-19 13:47:41
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\hook\useAutoLogin.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import {
  equals, prop, compose, when,
} from 'ramda';
import { useRequest } from '@mrrs878/hooks';
import { AUTO_LOGIN } from '../api/auth';
import { useUser } from '../store';

export default function useAutoLogin() {
  const [, loginRes] = useRequest(AUTO_LOGIN);
  const [, login, logout] = useUser();
  useEffect(() => {
    when<any, void>(
      compose(equals(true), prop('success')),
      (tmp) => {
        localStorage.setItem('auth_token', tmp?.data.token);
        login(tmp?.data);
      },
    )(loginRes);
    when<any, void>(
      compose(equals(false), prop('success')),
      (tmp) => {
        message.info(tmp?.return_message);
        localStorage.removeItem('auth_token');
        logout();
      },
    )(loginRes);
  }, [loginRes, login, logout]);
}
