/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 14:24:50
 * @LastEditTime: 2021-09-26 21:07:54
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\api\setting.ts
 */
import ajax from 'src/tool/ajax';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/setting`;

export const GET_MENUS = (): Promise<IGetMenusRes> => ajax.get(`${BASE_URL}/menu`);
export const GET_MENU = (data: IGetMenuReq): Promise<IGetMenusRes> => ajax.get(`${BASE_URL}/menu/${data.role}`);
export const UPDATE_MENU = (data: IUpdateMenuReq): Promise<IUpdateMenuRes> => ajax.put(`${BASE_URL}/menu/${data.id}`, data);
export const UPDATE_MENUS = (data: IUpdateMenusReq): Promise<IUpdateMenuRes> => ajax.put(`${BASE_URL}/menu`, data);
export const CREATE_MENU = (data: ICreateMenuReq): Promise<ICreateMenuRes> => ajax.post(`${BASE_URL}/menu`, data);
