/*
 * @Author: your name
 * @Date: 2021-04-07 13:07:22
 * @LastEditTime: 2021-04-07 15:36:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/api/auth.ts
 */
import ajax from '../tool/ajax';

const BASE_URL = 'http://localhost:3002/blog/auth';

export const GET_PUZZLE_IMG = (): Promise<GetPuzzleImgResI> => ajax.get(`${BASE_URL}/puzzleImg`);
export const CHECK_PUZZLE_IMG = (data: CheckPuzzleReqI): Promise<CheckPuzzleResI> => ajax.get(`${BASE_URL}/checkPuzzle/${data.session}/${data.left}`);
