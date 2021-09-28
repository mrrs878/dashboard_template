/*
* @Author: mrrs878@foxmail.com
* @Date: 2021-09-28 19:39:40
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-28 21:26:01
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
    if (position === -1) return;

    const tmp = clone(menuArray);
    const selectedMenu = tmp.find((item) => item.id === target?.id);
    if (!selectedMenu) return;

    let preMenu;
    const sub = tmp.filter((item) => item.parent === target?.parent)
      .sort((a, b) => a.position - b.position);
    if (action === Direction.up) {
      preMenu = sub.find(
        (item) => item.position < position && item.parent === target?.parent,
      );
    } else if (action === Direction.down) {
      preMenu = sub.find(
        (item) => item.position > position && item.parent === target?.parent,
      );
    }
    if (!preMenu) return;

    try {
      const positionTmp = preMenu.position;
      selectedMenu.position = positionTmp;
      preMenu.position = selectedMenu.position;

      const { return_code, return_message } = await updateMenus(tmp);
      message.info(return_message);
      if (return_code === 0) getMenus();
    } catch (e) {
      message.error('网络错误，稍后重试');
    }
  };
  return <const>([
    swapping,
    swap,
  ]);
}

export { useSwapMenu, Direction };
