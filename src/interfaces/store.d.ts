/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 09:45:17
 * @LastEditTime: 2021-07-30 10:37:34
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
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
  menuArray: Array<IMenuItem>,
  menuRoutes: Record<string, string>;
  menuTitles: Record<string, string>;
  permissionUrls: Array<IPermissionUrl>;
  tags: Array<ITag>,
}
