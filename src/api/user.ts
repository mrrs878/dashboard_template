/*
 * @Author: your name
 * @Date: 2021-03-30 10:04:47
 * @LastEditTime: 2021-03-30 10:06:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/api/user.ts
 */
import ajax from '../tool/ajax';

const BASE_URL = 'http://localhost:3003/setting';

export const GET_USERS = (): Promise<any> => ajax.get(`${BASE_URL}/user`);
export const GET_USER = (data: any): Promise<any> => ajax.get(`${BASE_URL}/user/${data.role}`);
