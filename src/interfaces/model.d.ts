/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 14:31:07
 * @LastEditTime: 2021-04-13 09:58:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/interfaces/model.d.ts
 */
interface IMenuItem {
  id?: number;
  key: string;
  icon?: Object;
  icon_name?: string;
  title: string;
  path: string;
  children?: Array<IMenuItem>;
  parent: number;
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
