/*
 * @Author: your name
 * @Date: 2021-02-24 10:13:41
 * @LastEditTime: 2021-04-07 18:57:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/layout/index.tsx
 */

import { ConfigProvider, Layout } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MHeader from '../components/MHeader';
import MMenu from '../components/MMenu';
import MPageHeader from '../components/MPageHeader';
import MTagsBar from '../components/MTagsBar';
import useGetMenu from '../hook/useGetMenu';
import Router from '../route';
import { useFullScreen } from '../store';

const { Content, Footer, Sider } = Layout;

const MLayout = () => {
  const [isFullScreen] = useFullScreen();
  useGetMenu(false, true);
  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh' }}>
          {
          !isFullScreen && (
          <Sider collapsible>
            <MMenu />
          </Sider>
          )
        }
          <Layout className="site-layout">
            {
            !isFullScreen && (
              <MTagsBar />
            )
          }
            {
            !isFullScreen && (
              <MHeader />
            )
          }
            <Content style={{ margin: '0 16px' }}>
              {
              !isFullScreen && <MPageHeader />
            }
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
