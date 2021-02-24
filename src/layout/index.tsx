/*
 * @Author: your name
 * @Date: 2021-02-24 10:13:41
 * @LastEditTime: 2021-02-24 23:05:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/layout/index.tsx
 */

import { Layout } from 'antd';
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MHeader from '../components/MHeader';
import MLoading from '../components/MLoading';
import MMenu from '../components/MMenu';
import MPageHeader from '../components/MPageHeader';
import { useFullScreen } from '../store';
import Home from '../view/home';

const { Content, Footer, Sider } = Layout;

const MLayout = () => {
  const [isFullScreen] = useFullScreen();
  return (
    <BrowserRouter>
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
              <MHeader />
            )
          }
          <Content style={{ margin: '0 16px' }}>
            {
              !isFullScreen && <MPageHeader />
            }
            <Suspense fallback={<MLoading />}>
              {/* <Router /> */}
              <Home />
            </Suspense>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            {`${new Date().getFullYear()}`}
            &nbsp;&copy; Mr.RS
          </Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MLayout;
