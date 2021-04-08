/*
 * @Author: your name
 * @Date: 2021-04-07 13:07:22
 * @LastEditTime: 2021-04-08 13:07:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/api/auth.ts
 */
import ajax from '../tool/ajax';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/auth`;

export const GET_PUZZLE_IMG = (): Promise<GetPuzzleImgResI> => ajax.get(`${BASE_URL}/puzzleImg`);
export const CHECK_PUZZLE_IMG = (data: CheckPuzzleReqI): Promise<CheckPuzzleResI> => ajax.get(`${BASE_URL}/verifyPuzzle/${data.session}/${data.left}`);
