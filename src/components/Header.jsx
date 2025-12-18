import { Avatar, Dropdown, Flex, Button, Image, Switch, Space, Typography } from "antd";
import Icon, { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTheme } from "../theme/ThemeContext";
import { theme } from "antd";
import { Header } from "antd/es/layout/layout";
import { Moon, Sun } from "lucide-react";

export default function AppHeader() {
  const { isDark, toggleTheme } = useTheme();
  const { token } = theme.useToken();

  return (
    <Header className="w-full shadow-sm flex justify-between items-center"
      style={{
        height: 64,
        backgroundColor: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}>
      <h1 className="text-xl font-semibold"></h1>

    <Flex gap="large" align="center" className="pe-4" horizontal>

        <Space>
            
            <Switch className="d-flex align-items-center"
            checkedChildren={<Moon color={isDark ? token.colorText : token.colorTextSecondary} size={20} />}
            unCheckedChildren={<Sun color={isDark ? "#fff" : token.colorTextSecondary} size={20} />}
            checked={isDark}
            onChange={toggleTheme}
            />
            
            
        </Space>

        <Dropdown menu={{
            items: [
                {
                    key: '1',
                    label: <Space size={8} align="center">
                        <Image src="/flags/ru.png" width={20} preview={false} className="me-2"/>
                        Русский
                    </Space>,
                    gap: 'large',
                },
                {
                    key: '2',
                    label: <Space size={8} align="center">
                        <Image src="/flags/tm.png" width={20} preview={false} className="me-2"/>
                        Türkmen
                    </Space>,
                },
            ],
            }} trigger={['click']} placement="bottomCenter">
            <Button type="text"><Image src="/flags/tm.png" width={20} preview={false} className="me-2"/> Türkmen</Button>
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
          <Avatar size={40} src="https://www.w3schools.com/howto/img_avatar.png" alt="User Avatar" />
        </Dropdown>
    </Flex>
    </Header>
  )
}