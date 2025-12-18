import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import Input from '../components/ui/Input';
import './Login.css';
import { UserIcon } from 'lucide-react';

// Иконки для инпутов
const EmailIcon = () => (
    <svg className="input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PasswordIcon = () => (
    <svg className="input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const Login = () => {
    const [formData, setFormData] = useState({
        email: 'admin',
        password: 'admin'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        // if (!formData.email) {
        //     newErrors.email = 'Email обязателен';
        // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        //     newErrors.email = 'Неверный формат email';
        // }
        
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 3) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        
        // Очищаем ошибку при изменении
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setErrors({});

        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            navigate('/banners');
        } else {
            setErrors({
                general: result.message
            });
        }
        
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2 className="login-title">Админ Панель</h2>
                    <p className="login-subtitle">Введите ваши данные для входа</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    {errors.general && (
                        <div className="login-error-general">
                            {errors.general}
                        </div>
                    )}
                    
                    <Input
                        label="Логин"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        placeholder="Login"
                        error={errors.email}
                        required
                        icon={<UserIcon />}
                        iconPosition="left"
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                    />
                    
                    <Input
                        label="Пароль"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange('password')}
                        placeholder="Введите ваш пароль"
                        error={errors.password}
                        required
                        icon={<PasswordIcon />}
                        iconPosition="left"
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="login-button"
                    >
                        {loading ? (
                            <>
                                <span className="login-button-spinner"></span>
                                Вход...
                            </>
                        ) : 'Войти'}
                    </button>
                </form>
                
                <div className="login-footer">
                    <a href="/forgot-password" className="login-link">
                        Забыли пароль?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;