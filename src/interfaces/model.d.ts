/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 14:31:07
 * @LastEditTime: 2021-04-11 14:17:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/interfaces/model.d.ts
 */
interface IMenuItem {
  id?: number;
  key: string;
  icon?: Object;
  icon_name?: string;
  title: string;
  path: string;
  children?: Array<IMenuItem>;
  sub_menu: Array<string>;
  parent: string;
  role?: Array<number>;
  status: number;
  position: number;
}

interface IPermissionUrl {
  id: number;
  url: string;
  role: number;
}

interface IUser {
  id: number;
  name: string;
  age: number;
  address: string;
  role: number;
}
