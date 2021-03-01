/*
 * @Author: your name
 * @Date: 2021-02-26 18:16:29
 * @LastEditTime: 2021-03-01 14:37:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/route/index.tsx
 */

import React, { Suspense, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import MLoading from '../components/MLoading';
import useDocumentTitle from '../hook/useDocumentTitle';
import { useModel } from '../store';
import { getCookie } from '../tool';

const Home = React.lazy(() => import('../view/home'));
const Profile = React.lazy(() => import('../view/profile'));

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
];

const GuardComponent = (props: GuardComponentPropsI) => {
  const [titles] = useModel('menuTitles');
  useDocumentTitle(titles[props.path]);
  const Component = (props.component) as any;
  useEffect(() => {
    if (props.auth && !getCookie('auth_token')) window.location.href = '/auth/login';
  }, [props.auth]);
  return <Component />;
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

export default Router;
