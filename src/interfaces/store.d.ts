/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 09:45:17
 * @LastEditTime: 2021-04-11 14:03:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/interfaces/index.d.ts
 */
interface IUser {
  name: string;
  age: number;
}

interface IState {
  fullScreen: boolean;
  user: IUser;
  addresses?: Array<string>;
  menu: Array<IMenuItem>;
  menuRoutes: Record<string, string>;
  menuTitles: Record<string, string>;
  permissionUrls: Array<IPermissionUrl>;
}

interface IActions<T extends Actions, P> {
  type: T;
  data: P;
}
