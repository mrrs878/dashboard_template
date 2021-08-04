/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 10:25:01
 * @LastEditTime: 2021-08-04 19:25:56
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: d:\Data\Personal\MyPro\dashboard_template\src\components\MMenu\index.tsx
 */
import React, { useCallback, useMemo } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import * as _Icon from '@ant-design/icons';
import { and, clone, ifElse } from 'ramda';
import style from './index.module.less';
import { useModel } from '../../store';

const { SubMenu } = Menu;
const Icon: Record<string, any> = clone(_Icon);

type MenuClickActions = 'navigate';

interface PropsI extends RouteComponentProps {
}

const MMenu: React.FC<PropsI> = (props: PropsI) => {
  const [menu] = useModel('menu');

  const MENU_CLICK_HANDLER: Record<MenuClickActions, Function> = useMemo(() => ({
    navigate(path: string) {
      props.history.push(`${path}`);
    },
  }), [props.history]);

  const onMenuClick = useCallback(({ key }: any) => {
    MENU_CLICK_HANDLER.navigate(key);
  }, [MENU_CLICK_HANDLER]);

  const dynamicIcon = useCallback((iconName: string | Object | undefined) => {
    if (typeof iconName !== 'string') return iconName;
    return iconName ? React.createElement(Icon[iconName]) : '';
  }, []);

  const menuAvailable = (item: IMenuItem) => and(
    item.status === 0,
    (item.children?.length || 0) > 0,
  );

  const walkMenu = useCallback((item: IMenuItem) => ifElse(
    menuAvailable,
    () => (
      <SubMenu key={item.key} icon={dynamicIcon(item.icon_name)} title={item.title}>
        {
          item.children?.map((child) => walkMenu(child))
        }
      </SubMenu>
    ),
    () => (
      <Menu.Item icon={item.parent === -1 ? dynamicIcon(item.icon_name) : ''} key={item.key}>{ item.title }</Menu.Item>
    ),
  )(item), [dynamicIcon]);

  const generateMenu = useCallback((menuTree: Array<IMenuItem> | undefined) => (
    menuTree && (
      <Menu onClick={onMenuClick} activeKey={window.location.pathname} defaultSelectedKeys={[window.location.pathname]} mode="inline" theme="dark">
        <div className={style.logo} key="logo">
          <a href="https://" target="_blank" rel="noreferrer">
            this is logo
          </a>
        </div>
        {
          menuTree?.filter((item) => item.status === 0).map((item) => walkMenu(item))
        }
      </Menu>
    )
  ), [onMenuClick, walkMenu]);

  return (
    <div className={style.menuContainer}>
      {
        generateMenu(menu)
      }
    </div>
  );
};

export default withRouter(MMenu);
