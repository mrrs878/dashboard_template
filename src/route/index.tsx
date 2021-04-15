/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-26 18:16:29
 * @LastEditTime: 2021-04-15 16:39:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/route/index.tsx
 */

import {
  and, compose, not, when,
} from 'ramda';
import React, { Suspense, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import MLoading from '../components/MLoading';
import useDocumentTitle from '../hook/useDocumentTitle';
import { useModel } from '../store';

const Home = React.lazy(() => import('../view/home'));
const Profile = React.lazy(() => import('../view/profile'));
const Login = React.lazy(() => import('../view/auth/login'));
const ForbiddenPage = React.lazy(() => import('../view/auth/403'));
const Setting = React.lazy(() => import('../view/setting'));
const MenuSetting = React.lazy(() => import('../view/setting/menu'));
const Permission = React.lazy(() => import('../view/setting/permission'));

interface GuardComponentPropsI {
  component: any;
  auth: boolean;
  path: string;
}

const ROUTES: Array<RouteConfigI> = [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/',
    component: Home,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/auth/login',
    component: Login,
    auth: false,
  },
  {
    path: '/setting',
    component: Setting,
    auth: true,
  },
  {
    path: '/setting/menu',
    component: MenuSetting,
    auth: true,
  },
  {
    path: '/setting/permission',
    component: Permission,
    auth: true,
  },
];

const GuardComponent = (props: GuardComponentPropsI) => {
  const [titles] = useModel('menuTitles');
  const [permissionUrls] = useModel('permissionUrls');
  const [user] = useModel('user');
  useDocumentTitle(titles[props.path]);

  const Component = (props.component) as any;
  let tmp = <Component />;

  useEffect(() => {
    when(
      compose(and(props.auth), not),
      () => { window.location.href = '/auth/login'; },
    )(localStorage.getItem('auth_token'));
  }, [props.auth]);
  if (user.role === -1
    || user.role > (permissionUrls.find((item) => item.url === props.path)?.role || 0)) {
    tmp = <ForbiddenPage />;
  }
  return tmp;
};

const Router = () => (
  <Suspense fallback={<MLoading />}>
    <Switch>
      {
        ROUTES.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact || true}
            render={() => (
              <GuardComponent
                path={route.path}
                component={route.component}
                auth={route.auth || false}
              />
            )}
          />
        ))
      }
    </Switch>
  </Suspense>
);

export { ROUTES };

export default Router;
