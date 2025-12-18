import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = forwardRef(({
    label,
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    success,
    disabled = false,
    required = false,
    icon,
    iconPosition = 'left',
    className = '',
    fullWidth = false,
    variant = 'default', // 'default', 'outlined', 'filled'
    size = 'medium', // 'small', 'medium', 'large'
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // eslint-disable-next-line react-hooks/purity
    const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isPasswordType = type === 'password';

    const getInputType = () => {
        if (isPasswordType && showPassword) return 'text';
        return type;
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const getVariantClasses = () => {
        const variants = {
            default: 'input-variant-default',
            outlined: 'input-variant-outlined',
            filled: 'input-variant-filled'
        };
        return variants[variant] || variants.default;
    };

    const getSizeClasses = () => {
        const sizes = {
            small: 'input-size-small',
            medium: 'input-size-medium',
            large: 'input-size-large'
        };
        return sizes[size] || sizes.medium;
    };

    const getStatusClasses = () => {
        if (error) return 'input-status-error';
        if (success) return 'input-status-success';
        if (isFocused) return 'input-status-focused';
        return '';
    };

    return (
        <div className={`
            input-container 
            ${fullWidth ? 'input-full-width' : ''}
            ${disabled ? 'input-disabled' : ''}
            ${className}
        `}>
            {label && (
                <label 
                    htmlFor={inputId} 
                    className="input-label"
                >
                    {label}
                    {required && <span className="input-required"> *</span>}
                </label>
            )}
            
            <div className={`
                input-wrapper 
                ${getVariantClasses()} 
                ${getSizeClasses()} 
                ${getStatusClasses()}
            `}>
                {icon && iconPosition === 'left' && (
                    <span className="input-icon input-icon-left">
                        {icon}
                    </span>
                )}
                
                <input
                    ref={ref}
                    id={inputId}
                    type={getInputType()}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className="input-field"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
                
                {isPasswordType && (
                    <button
                        type="button"
                        className="input-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        disabled={disabled}
                    >
                        {showPassword ? (
                            <svg className="input-icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="input-icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
                
                {icon && iconPosition === 'right' && !isPasswordType && (
                    <span className="input-icon input-icon-right">
                        {icon}
                    </span>
                )}
            </div>
            
            {error && (
                <div id={`${inputId}-error`} className="input-error-message">
                    {error}
                </div>
            )}
            
            {success && !error && (
                <div className="input-success-message">
                    {success}
                </div>
            )}
            
            {props.maxLength && (
                <div className="input-counter">
                    {value?.length || 0} / {props.maxLength}
                </div>
            )}
        </div>
    );
});

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url', 'search']),
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    success: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    fullWidth: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'outlined', 'filled']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
};

Input.displayName = 'Input';

export default Input;