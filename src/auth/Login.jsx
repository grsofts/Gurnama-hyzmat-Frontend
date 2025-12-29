import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import './Login.css';
import { UserIcon } from 'lucide-react';
import { Flex, Form, Input, Button, Checkbox, Card } from 'antd';
import Typography from 'antd/es/typography/Typography';




const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin");

    const onSubmit = async () => {
    const res = await login(username, password);
    if (res.success) {
      console.log('Login successful:', res);
      
      navigate("/banners", { replace: true });
    }
  };

  const onFinish = values => {
    console.log('Success:', values);
    };
    const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    };

  return (
    <Flex align='center' justify='center' className='h-screen login-container' vertical>
        <Card className='shadow-lg'>
            <Typography level={3} style={{ marginBottom: '20px' }}>Авторизация</Typography>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            >
            <Form.Item
              label="Имя пользователя"
              name="username"
              rules={[{ required: true, message: 'Пожалуйста, введите ваше имя пользователя!' }]}>
              <Input value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              rules={[{ required: true, message: 'Пожалуйста, введите ваш пароль!' }]}
              >
              <Input.Password value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" label={null}>
              <Checkbox>Запомнить меня</Checkbox>
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" onClick={onSubmit}>
                  Войти
              </Button>
            </Form.Item>
    </Form>  
        </Card>
    </Flex>
  );
};

export default Login;