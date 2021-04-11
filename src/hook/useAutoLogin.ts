/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-11 15:46:49
 * @LastEditTime: 2021-04-11 17:01:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\hook\useAutoLogin.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import {
  ifElse, equals, prop, compose,
} from 'ramda';
import { AUTO_LOGIN } from '../api/auth';
import { useModel } from '../store';
import useRequest from './useRequest';

export default function useAutoLogin() {
  const [, loginRes] = useRequest(AUTO_LOGIN);
  const [, updateUser] = useModel('user');
  useEffect(() => {
    ifElse(equals(undefined), () => {}, (res) => {
      ifElse(compose(equals(true), prop('success')), (tmp) => {
        localStorage.setItem('auth_token', tmp?.data.token);
        updateUser(tmp?.data);
      }, (tmp) => {
        message.info(tmp?.return_message, 1);
        localStorage.removeItem('auth_token');
      })(res);
    })(loginRes);
  }, [loginRes, updateUser]);
}
