/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 14:29:29
 * @LastEditTime: 2021-08-03 15:41:33
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: d:\Data\Personal\MyPro\dashboard_template\src\tool\ajax.ts
 */
import axios from 'axios';
import { clone } from 'ramda';

const ajax = axios.create({
  timeout: 12000,
});

ajax.interceptors.request.use((config) => {
  const tmp = clone(config);
  tmp.headers.Authorization = 'Bearer test';
  return tmp;
});
ajax.interceptors.response.use(async (response) => {
  if ([401].includes(response.data.code)) {
    localStorage.setItem('auth_token', '');
    window.location.href = '/auth/login';
    return null;
  }
  return (response.data);
}, (error: any) => (error));

export default ajax;
