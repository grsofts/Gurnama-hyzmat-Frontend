import React, { useState } from 'react';
import { Flex, Layout } from 'antd';
import Sidebar from './Sidebar';
import AppHeader from './Header';
import { Outlet } from "react-router-dom";
import Footer from './Footer';


const { Content } = Layout;

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className='d-flex'>
      <Sidebar  collapsed={collapsed}/>
      <Layout>
        <AppHeader collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(prev => !prev)}/>
        <Content style={{ padding: '20px 30px' }}>
          <Outlet />
          {children}
        </Content>
        <Footer/>
      </Layout>
    </Layout>
  )
}