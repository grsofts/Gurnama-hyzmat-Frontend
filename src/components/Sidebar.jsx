// import { useState } from 'react';
import { Flex, Image, Layout, Menu, theme, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, BriefcaseBusiness, Handshake, House, Images, Layers, LayoutDashboard, Settings, ShoppingCart, Undo2, User2, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next'
import Logo from '../assets/gurnama-logo.png'


const { Sider } = Layout;


export default function Sidebar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { t } = useTranslation();


  
  const items = [
    {
      key: '/banners',
      icon: <Images size={18} />,
      label: t('menu.banners'),
    },
    {
      //this need set active when viewing order details

      key: '/projects',
      icon: <Layers size={18}/>,
      label: t('menu.projects'),
    },
    {
      key: '/certificates',
      icon: <Award size={18}/>,
      label: t('menu.certificates'),
    },
    {
      key: '/partners',
      icon: <Handshake size={18}/>,
      label: t('menu.partners'),
    },
    {
      key: '/services',
      icon: <BriefcaseBusiness size={18}/>,
      label: t('menu.services'),
    },
    //here add seperator

    {
      key: '/users',
      icon: <User2 size={18}/>,
      label: t('menu.users'),
    },
  ];

  const getSelectedKey = (pathname) => {
    if (pathname.startsWith('/projects')) return '/projects'
    if (pathname.startsWith('/certificates')) return '/certificates'
    if (pathname.startsWith('/partners')) return '/partners'
    if (pathname.startsWith('/services')) return '/services'
    if (pathname.startsWith('/banners')) return '/banners'
    if (pathname.startsWith('/users')) return '/users'
    return pathname
  }

  return (
    <Sider
      width={ 250}
      collapsed={collapsed}
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
         left:0 ,
        backgroundColor: token.colorBgContainer,
      }}
    >
      <Flex align='center' gap={2} justify='center' style={{ height: 120 }}> 
        <Flex align='center' justify='center' horizontal>     
          <Image src={Logo} sizes='small' size='small' style={{ borderRadius: 8, height: collapsed ? 40 : 64 }} preview={{ open: false }}/> 
          {!collapsed ? <Typography level={2} style={{fontWeight: 'bold', fontSize:collapsed ? 15 : 20}}>Gurnama Hyzmat</Typography> : null}
        </Flex>
      </Flex>
      <Menu
        theme={token.dark ? 'dark' : 'light'}
        mode="inline"
        style={{ borderRight: 0 }}
        items={items}
        selectedKeys={[getSelectedKey(location.pathname)]}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
}
