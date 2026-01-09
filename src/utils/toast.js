import { message } from 'antd';

const DEFAULT_CONFIG = {
  duration: 2
};

const show = (type, content, options = {}) => {
  message.open({
    type,
    content,
    ...DEFAULT_CONFIG,
    ...options,
  });
};

export const toast = {
  success: (content, options) => show('success', content, options),
  error:   (content, options) => show('error', content, options),
  warning: (content, options) => show('warning', content, options),
  info:    (content, options) => show('info', content, options),
  loading: (content, options) => show('loading', content, options),
};
