/*
 * @Author: your name
 * @Date: 2021-02-24 14:31:07
 * @LastEditTime: 2021-02-24 15:05:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/interfaces/model.d.ts
 */
interface IMenuItem {
  _id?: string;
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
