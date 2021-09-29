/*
* @Author: mrrs878@foxmail.com
* @Date: 2021-09-28 19:39:40
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-29 19:35:48
 * @FilePath: \dashboard_template\src\view\setting\hooks\useSwapMenu.ts
*/
import { useRequest } from '@mrrs878/hooks';
import { message } from 'antd';
import { clone } from 'ramda';
import { UPDATE_MENUS } from 'src/api/setting';
import useGetMenu from 'src/hook/useGetMenu';

enum Direction {
  'up',
  'down',
}

function useSwapMenu() {
  const { getMenus } = useGetMenu(false, false);
  const [swapping,,updateMenus] = useRequest(UPDATE_MENUS, false);
  const swap = async (
    action: Direction,
    target: IMenuItem|undefined,
    menuArray: Array<IMenuItem>,
  ) => {
    const position = target?.position ?? -1;
    if (position === -1) return true;

    const tmp = clone(menuArray);
    const selectedMenu = tmp.find((item) => item.id === target?.id);
    if (!selectedMenu) return true;

    let preMenu;
    const sub = tmp.filter((item) => item.parent === target?.parent);
    if (action === Direction.up) {
      preMenu = sub.sort((a, b) => b.position - a.position).find(
        (item) => item.position < position && item.parent === target?.parent,
      );
    } else if (action === Direction.down) {
      preMenu = sub.sort((a, b) => a.position - b.position).find(
        (item) => item.position > position && item.parent === target?.parent,
      );
    }
    if (!preMenu) return true;

    try {
      const positionTmp = preMenu.position;
      preMenu.position = selectedMenu.position;
      selectedMenu.position = positionTmp;

      const { return_code, return_message } = await updateMenus(tmp);
      message.info(return_message);
      if (return_code === 0) getMenus();
      return true;
    } catch (e) {
      message.error('网络错误，稍后重试');
      return true;
    }
  };
  return <const>([
    swapping,
    swap,
  ]);
}

export { useSwapMenu, Direction };
