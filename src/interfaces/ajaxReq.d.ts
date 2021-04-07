/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2021-04-07 15:34:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\interface\ajaxReq.d.ts
 */
interface LoginReqI {
  name: string,
  password: string
}
interface GetMenuReqI {
}

interface CreateMenuReqI extends IMenuItem {}

interface UpdateMenuReqI extends IMenuItem {}

interface CheckPuzzleReqI {
  left: number;
  session: string;
}

interface GetDictsReqT {
}

interface GetDictReqT {
  id: string
}

interface UpdateDictReqT extends DictI {
}

interface CreateDictReqT extends DictI{
}

interface DeleteDictReqT {
  id: number
}

interface GetMenuReqI {
  role: string
}

interface UpdateUserInfoReqI {
  name: string;
  role: number;
  avatar: string;
  createdBy: number;
  profession: string;
  signature: string;
  department: string;
  address: string;
  tags: Array<string>;
  teams: Array<string>;
}

interface UpdateUserStatusReqI {
  status: number;
  userId: string;
}
