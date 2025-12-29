import { Avatar, Dropdown, Flex, Button, Image, Switch, Space, Typography } from "antd";
import Icon, { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useTheme } from "../theme/ThemeContext";
import { theme } from "antd";
import { Header } from "antd/es/layout/layout";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from 'react-i18next'
import { useAuth } from "../auth/useAuth";
import { useLanguage } from "../utils/language/useLanguage";
import Spacer from "./ui/Spacer";



export default function AppHeader({ collapsed, onToggleSidebar }) {
  const { isDark, toggleTheme } = useTheme();
  const { token } = theme.useToken();
  const { user } = useAuth();
  
  const { i18n } = useTranslation()
  const { setLang } = useLanguage();
  const onLangChange = ({ key }) => {
    setLang(key)
    i18n.changeLanguage(key)
    localStorage.setItem('lang', key)
  }

  const menuItems = [
    {
      key: 'ru',
      label: (
        <Space size={8} align="center">
          <Image src="/flags/ru.png" width={20} preview={false} />
          Русский
        </Space>
      ),
    },
    {
      key: 'tm',
      label: (
        <Space size={8} align="center">
          <Image src="/flags/tm.png" width={20} preview={false} />
          Türkmen
        </Space>
      ),
    },
  ]

  return (
    <Header className="w-full shadow-sm ps-0"
      style={{
        height: 64,
        top: 0,
        position: 'sticky',
        zIndex: 10,
        backgroundColor: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}>

      <Flex gap="large" align="center" justify="center" className="" horizontal>
        <Button type="text" onClick={onToggleSidebar}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Spacer/>
        <Space>
          <Switch className="d-flex align-items-center"
            checkedChildren={<Moon color={isDark ? token.colorText : token.colorTextSecondary} size={20} />}
            unCheckedChildren={<Sun color={isDark ? "#fff" : token.colorTextSecondary} size={20} />}
            checked={isDark}
            onChange={toggleTheme}
            />
        </Space>

        <Dropdown
          menu={{
            items: menuItems,
            onClick: onLangChange,
          }}
          trigger={['click']}
          placement="bottomCenter"
        >
          <Button type="text">
            <Image
              src={`/flags/${i18n.language}.png`}
              width={20}
              preview={false}
              className="me-2"
            />
            {i18n.language === 'ru' ? 'Русский' : 'Türkmen'}
          </Button>
        </Dropdown>

        <Dropdown menu={{
          items: [
            {
              key: '1',
              label: 'Profile',
            },
            {
              key: '2',
              label: 'Settings',
            },
            {
              key: '3',
              label: 'Logout',
            },
          ],
        }} trigger={['click']} placement="bottomCenter">
          <Flex align="center" gap={2} style={{ cursor: 'pointer' }}>
          <Flex vertical gap={0}>
            <Typography.Text>{user.name}</Typography.Text>
            <Typography.Text type="secondary">{user.username}</Typography.Text>
          </Flex>
          <Avatar bordered size={40} src='https://avatar.iran.liara.run/public/33' alt="" />
          </Flex>
        </Dropdown>
      </Flex>
    </Header>
  )
}