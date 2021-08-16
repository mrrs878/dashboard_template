/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 10:13:41
 * @LastEditTime: 2021-08-16 13:49:35
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \awesomee:\frontEnd\myPro\dashboard_template\src\layout\index.tsx
 */

import { ConfigProvider, Layout, message } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  compose, curry, equals, not, when, always,
} from 'ramda';
import MHeader from '../components/MHeader';
import MMenu from '../components/MMenu';
import MTagsBar from '../components/MTagsBar';
import useGetPermissionUrls from '../hook/useGetPermissionUrls';
import useGetMenu from '../hook/useGetMenu';
import Router from '../route';
import { useFullScreen } from '../store';
import initExceptionSentry from '../tool/error';

const { Content, Footer, Sider } = Layout;

const withFullScreen = (com: any) => when(equals(false), always(com));

const MLayout = () => {
  const [isFullScreen] = useFullScreen();

  useEffect(() => {
    message.config({ duration: 1 });
    when(
      compose(not, equals('development')),
      curry(initExceptionSentry)({ url: 'http://localhost:3003/exceptionLog' }),
    )(process.env.NODE_ENV);
  }, []);
  useGetMenu(false, true);
  useGetPermissionUrls(false, true);

  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh' }}>
          {
            withFullScreen(
              <Sider collapsible>
                <MMenu />
              </Sider>,
            )(isFullScreen)
          }
          <Layout className="site-layout">
            {
              withFullScreen(
                <MHeader />,
              )(isFullScreen)
            }
            {
              withFullScreen(
                <MTagsBar />,
              )(isFullScreen)
            }
            <Content style={{ margin: '16px' }}>
              <Router />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              {`${new Date().getFullYear()}`}
            &nbsp;&copy; Mr.RS
            </Footer>
          </Layout>
        </Layout>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default MLayout;
