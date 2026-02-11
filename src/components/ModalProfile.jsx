import { Form, Modal, Input, Tabs, Image, Flex, Space, Divider, Switch, Upload, Checkbox, Tooltip, DatePicker } from "antd";
import { Info, InfoIcon, LucideInfo, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
// import certService from "../../api/certificate.service";
import { toast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import userService from "../api/users.service"

export default function ModalProfile({ modal, onClose, onSuccess }) {

  const { t } = useTranslation();
  
  const { user: currentUser, updateUser } = useAuth();
  const [ active, setActive ] = useState(false);
  const [ changePass, setChangePass ] = useState(false);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!modal.open) {
      form.resetFields();
      setActive(false);
      return;
    }

    const loadUser = async (id) => {
      try {
          setLoading(true);
          const data = await userService.getUserById(id);
          const user = data[0];
          form.setFieldsValue({
            login:user.login,
            name:user.name
          });
          setActive(user.is_active)
      } finally {
          setLoading(false);
      }
    };

    if (modal.mode === 'create') {
      form.resetFields();
      return;
    }

    if (modal.mode === 'edit-self') {
      form.setFieldsValue({
        login:currentUser.username,
        name:currentUser.name,
      });
      setActive(true);
      return;
    }

    if (modal.mode === 'edit-user' && modal.userId) {
      loadUser(modal.userId);
    }
  }, [modal, currentUser, setActive, form]);

  const handleSubmit = async () => {
    try{
      try {
        await form.validateFields();
        setLoading(true);
      } catch {
        // есть ошибки
        toast.info(t('toasts.fields_required'));
        return;
      }

      const values = await form.validateFields();


      if(changePass){
        const password = values.password;
        const verify = values.password_verify;
        
        if(password != verify){
          toast.warning(t('toasts.password_verify_error'));
          return;
        }
        
        if(password.length <= 5){
          toast.warning(t('toasts.password_length'));
          return;
        }
      }

      const payload = {
          name: values.name,
          login: values.login,
          is_active: active,
          password: values.password
        };
      // Отправка формы
      if(modal.mode === 'create'){
        await userService.createUser(payload);
        toast.success(t('response_result.user.create'));
      }else{
        const id = modal.mode === 'edit-self' ? currentUser.id : modal.userId;
        await userService.updateUser(payload, id, currentUser.username);
        toast.success(t('response_result.user.update'));

        if(modal.mode === 'edit-self'){
          //
          updateUser({
            name: values.name
          })
        }else if(modal.mode === 'edit-user'){
          if(values.login === currentUser.username){
            updateUser({
              name: values.name
            })
          }
        }
      }
      onClose();
      onSuccess?.();
    }catch(error){
      const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Server error:' + error;
      toast.warning(message);
    }finally{
      if (onSuccess) {
          onSuccess(); 
        }
      setLoading(false);
    }
  };

  const onChangePass = e => {
    setChangePass(e.target.checked);
  };

  return (
    <Modal 
      title={modal.mode==='create' ? t('add_user') : modal.mode === 'edit-user' ? t('edit_user') : t('actions.profile')}
      open={modal.open} 
      onCancel={onClose} 
      onOk={handleSubmit}
      centered 
      cancelButtonProps={{hidden:loading}}
      confirmLoading={loading}
      okButtonProps={{disabled:form.getFieldsError().some(({ errors }) => errors.length)}}
      closable={false}
      wrapProps={{ onClick: e => e.stopPropagation() }}
      okText={t('buttons.save')}>
      <Form form={form} layout="vertical" initialValues={{ order: 0 }}>
        
        <Divider />
        <Flex direction="column" gap={7} vertical>
          <Form.Item label={t('login')} name="login" rules={[{ required: true, message: t('error_fields.auth.login') }]}>
            <Input disabled={modal.mode != 'create'} placeholder={t('login')} />
          </Form.Item>
          <Form.Item label={t('fields.user_name')} name="name" rules={[{ required: true, message: t('error_fields.user.name') }]}>
            <Input disabled={loading} placeholder={t('fields.user_name')} />
          </Form.Item>

        </Flex>

        <Divider variant="solid"/>
        <h3>{t('fields.user_password')}</h3>
        <Checkbox onChange={onChangePass} checked={changePass}>{t('change_pass')}</Checkbox>
        {
          changePass && (
          <Flex direction="column" style={{marginTop:12}} gap={7} horizontal>
            <Form.Item label={t('fields.password')} name="password" rules={[{ required: changePass, message: t('error_fields.user.password') }]}>
              <Input disabled={loading} placeholder={t('fields.password')} />
            </Form.Item>
            <Form.Item label={t('fields.user_password_confirm')} name="password_verify" rules={[{ required: changePass, message: t('error_fields.user.verify') }]}>
              <Input disabled={loading} placeholder={t('fields.user_password_confirm')} />
            </Form.Item>
        </Flex>)
        }
        
        {
          modal.mode != 'edit-self' && (
          <Flex direction="column" style={{marginTop:45}} gap={5} horizontal>
            <Switch checked={active} onChange={setActive} disabled={loading} /> <span>{t('status.active')}</span>
          </Flex>        
          )}

      </Form>
    </Modal>
  )
}

