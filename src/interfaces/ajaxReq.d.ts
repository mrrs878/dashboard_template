/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2021-04-13 17:41:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\interface\ajaxReq.d.ts
 */
interface ILoginReq {
  name: string,
  password: string
}
interface IGetMenuReq {
}

interface ICreateMenuReq extends IMenuItem {}

interface IUpdateMenuReq extends IMenuItem {}

interface IUpdateMenusReq extends Array<IMenuItem> {}

interface ICheckPuzzleReq {
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

interface IGetMenuReq {
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
