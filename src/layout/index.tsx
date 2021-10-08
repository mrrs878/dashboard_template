/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 10:13:41
 * @LastEditTime: 2021-10-08 21:10:15
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\layout\index.tsx
 */

import { ConfigProvider, Layout, message } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { useEffect, useState } from 'react';
import { BrowserRouter, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  compose, curry, equals, not, when, always,
} from 'ramda';
import MHeader from 'src/components/MHeader';
import MMenu from 'src/components/MMenu';
import useGetPermissionUrls from 'src/hook/useGetPermissionUrls';
import useGetMenu from 'src/hook/useGetMenu';
import Router from 'src/route';
import { useFullScreen, useModel } from 'src/store';
import initExceptionSentry from 'src/tool/error';
import { IMTabbarProps, MTabbar as Tabbar } from './MTabbar';

const { Content, Footer, Sider } = Layout;

const withFullScreen = (com: any) => when(equals(false), always(com));

interface IProps extends RouteComponentProps, IMTabbarProps {
  setActiveTab: (value: string) => void;
}

const MTabBar = withRouter((props: IProps) => {
  useEffect(() => {
    // do not switch tabs when closing inactive tabs
    if (props.tabs.map(({ path }) => path).includes(props.activeTab)) return;

    // automatically switch to the last tab when the active tab is closed
    if (props.tabs.length > 0) {
      props.history.push(props.tabs[props.tabs.length - 1]?.path || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history.push, props.tabs.length]);

  // automatically update activeTab when the page path changes
  useEffect(() => {
    const path = window.location.pathname;
    if (props.tabs.map((item) => item.path).includes(path)) props.setActiveTab(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.setActiveTab, props.tabs]);

  return (
    <Tabbar
      tabs={props.tabs}
      activeTab={props.activeTab}
      updateTabs={props.updateTabs}
      onTabChange={(path) => props.history.push(path)}
    />
  );
});

const MLayout = () => {
  const [tabs, setTabs] = useModel('tags');
  const [currentTab, setCurrentTab] = useState(tabs[0]?.path);
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
                <MTabBar
                  tabs={tabs}
                  updateTabs={setTabs}
                  activeTab={currentTab}
                  setActiveTab={setCurrentTab}
                />,
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
