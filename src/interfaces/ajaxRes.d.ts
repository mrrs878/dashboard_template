/*
 * @Author: your name
 * @Date: 2020-10-15 09:49:52
 * @LastEditTime: 2021-04-07 15:35:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\interfaces\ajaxRes.d.ts
 */
interface BaseResI<T> {
  success: boolean;
  code: number;
  data: T;
  msg: string;
}

interface LoginResI extends BaseResI<UserI>{
}
interface GetInfoByTokenResI extends BaseResI<UserI>{
}
interface LogoutResI extends BaseResI<any>{
}
interface GetMenusResI extends BaseResI<Array<IMenuItem>>{
}
interface CreateMenuResI extends BaseResI<IMenuItem> {}

interface UpdateMenuResI extends BaseResI<IMenuItem> {}

interface GetPuzzleImgResI extends BaseResI<{ canvas: string, block: string, session: string }> {}

interface CheckPuzzleResI extends BaseResI<any> {}

interface GetDictsResT extends BaseResI<Array<DictI>>{
}

interface GetDictResT extends BaseResI<DictI>{
}

interface GetAuthorCommentsResI extends BaseResI<Array<AuthorCommentsI>> {}

interface GetUsersResI extends BaseResI<Array<UserI>> {}

interface UpdateUserInfoResI extends BaseResI<UserI> {}

interface UpdateUserStatusI extends BaseResI<any> {}
