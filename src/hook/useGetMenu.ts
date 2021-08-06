/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-10 19:15:33
 * @LastEditTime: 2021-08-05 10:14:08
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: d:\Data\Personal\MyPro\dashboard_template\src\hook\useGetMenu.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { clone } from 'ramda';
import { reactHooks } from '@mrrs878/js-library';
import { GET_MENUS } from '../api/setting';
import { useModel } from '../store';

const { useRequest } = reactHooks;

function menuArray2Tree(src: Array<IMenuItem>) {
  const res: Array<IMenuItem> = [];
  const tmp: Array<IMenuItem> = clone<Array<IMenuItem>>(src);
  tmp.forEach((item) => {
    const parent = tmp.find((_item) => _item.id === item.parent);
    if (parent) {
      parent.children = parent.children || [];
      parent.children?.push(item);
      parent.children = parent.children.sort((a, b) => a.position - b.position);
    } else res.push(item);
  });
  return res.sort((a, b) => a.position - b.position);
}

function getMenuTitles(src: Array<IMenuItem>) {
  const menuTitles: Record<string, string> = {};
  src.forEach((item) => {
    menuTitles[item.path] = item.title;
  });
  return menuTitles;
}

function getMenuRoutes(src: Array<IMenuItem>) {
  const menuRoutes: Record<string, string> = {};
  src.forEach((item) => {
    menuRoutes[item.key] = item.path;
  });
  return menuRoutes;
}

export default function useGetMenu(autoMsg = true, authFetch = false) {
  const [, getMenusRes, getMenus] = useRequest(GET_MENUS, authFetch);
  const [, updateMenu] = useModel('menu');
  const [, updateMenuArray] = useModel('menuArray');
  const [, updateMenuRoutes] = useModel('menuRoutes');
  const [, updateMenuTitles] = useModel('menuTitles');
  useEffect(() => {
    if (!getMenusRes) return;
    if (autoMsg) message.info(getMenusRes.return_message);
    if (!getMenusRes.success) return;
    updateMenuArray(getMenusRes.data);
    updateMenuTitles(getMenuTitles(getMenusRes.data));
    updateMenuRoutes(getMenuRoutes(getMenusRes.data));
    updateMenu(menuArray2Tree(getMenusRes.data.filter(({ status }) => status !== 2)));
  }, [getMenusRes, autoMsg, updateMenuTitles, updateMenuRoutes, updateMenu, updateMenuArray]);

  return { getMenusRes, getMenus };
}
