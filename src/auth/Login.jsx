import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css';
import { Flex, Form, Input, Button, Checkbox, Card } from 'antd';
import Typography from 'antd/es/typography/Typography';
import { useTranslation } from 'react-i18next';
import { toast } from '../utils/toast';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useTranslation();
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin");

    const onSubmit = async () => {
      const res = await login(username, password);
      
      if (res.success) {
        toast.success(t('toasts.authorization_successful'));
        navigate("/banners", { replace: true });
      }else{
        toast.warning(t('toasts.login_or_password_invalid'));
        console.log(res.message);
        
      }
    };

  return (
    <Flex align='center' justify='center' className='h-screen login-container' vertical>
        <Card className='shadow-lg text-center' style={{  }}>
            <Typography level={5} style={{ marginBottom: '20px' }}>{t('authorization')}</Typography>
          <Form
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, width: '500px' }}
            initialValues={{ remember: true }}
            autoComplete="off"
            >
            <Form.Item
              label={t('login')}
              name="username"
              rules={[{ required: true, message: t('error_fields.auth.login') }]}>
              <Input value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Item>

            <Form.Item
              label={t('password')}
              name="password"
              rules={[{ required: true, message: t('error_fields.auth.password') }]}
              >
              <Input.Password value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item label={null}>
              <Button type="primary" className='mt-3' htmlType="submit" onClick={onSubmit}>
                  {t('buttons.login')}
              </Button>
            </Form.Item>
    </Form>  
        </Card>
    </Flex>
  );
};

export default Login;