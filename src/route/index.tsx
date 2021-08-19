/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-26 18:16:29
 * @LastEditTime: 2021-08-19 13:48:05
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 */

import {
  always,
  and, compose, cond, equals, filter, gt, lte, not, uniqBy,
} from 'ramda';
import React, { Suspense, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useDocumentTitle } from '@mrrs878/hooks';
import MLoading from '../components/MLoading';
import { useModel } from '../store';

const Home = React.lazy(() => import('../view/home'));
const Profile = React.lazy(() => import('../view/profile'));
const Login = React.lazy(() => import('../view/auth/login'));
const ForbiddenPage = React.lazy(() => import('../view/auth/403'));
const Setting = React.lazy(() => import('../view/setting'));
const MenuSetting = React.lazy(() => import('../view/setting/menu'));
const Permission = React.lazy(() => import('../view/setting/permission'));
const Editor = React.lazy(() => import('../view/editor'));
const ExceptionSentry = React.lazy(() => import('../view/exception'));

interface GuardComponentPropsI {
  component: any;
  auth: boolean;
  path: string;
}

const ROUTES: Array<IRouteConfig> = [
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
    path: '/setting/menu/:id(\\d+)',
    component: MenuSetting,
    auth: true,
  },
  {
    path: '/setting/permission',
    component: Permission,
    auth: true,
  },
  {
    path: '/editor',
    component: Editor,
  },
  {
    path: '/exceptionSentry',
    component: ExceptionSentry,
  },
];

const GuardComponent = (props: GuardComponentPropsI) => {
  const [titles] = useModel('menuTitles');
  const [permissionUrls] = useModel('permissionUrls');
  const [user] = useModel('user');
  const [, updateTags] = useModel('tags');

  const path = props.path.replace(/\/:(.+)/g, '');
  useDocumentTitle(titles[path] || '首页');

  useEffect(() => {
    updateTags((pre) => compose(
      uniqBy((item) => item.path),
      filter<ITag, 'array'>(({ title }) => title !== undefined),
    )([...pre, { path, title: titles[path] }]));
  }, [path, titles, updateTags]);

  const Component = (props.component) as any;
  const urlRole = permissionUrls.find((item) => item.url === props.path)?.role || 0;
  const token = localStorage.getItem('auth_token');

  return cond([
    [always(equals(path, '/')), always(<Redirect to="/home" />)],
    [always(and(equals(token, ''), props.auth)), always(<Redirect to="/auth/login" />)],
    [always(and(equals(token, ''), not(props.auth))), always(<Component />)],
    [always(gt(user.role, urlRole)), always(<ForbiddenPage />)],
    [always(lte(user.role, urlRole)), always(<Component />)],
  ])(user);
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
