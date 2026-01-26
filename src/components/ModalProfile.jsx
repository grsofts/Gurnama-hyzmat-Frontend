import { Form, Modal, Input, Tabs, Image, Flex, Space, Divider, Switch, Upload, Checkbox, Tooltip, DatePicker } from "antd";
import { Info, InfoIcon, LucideInfo, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
// import certService from "../../api/certificate.service";
import { toast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";


export default function ModalProfile({ open, mode, userId, onClose, onSuccess }) {

  const { t } = useTranslation();
  
  const { user: currentUser } = useAuth();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === 'create') {
      form.resetFields();
      return;
    }

    if (mode === 'edit-self') {
      form.setFieldsValue(currentUser);
      return;
    }

    if (mode === 'edit-user' && userId) {
      loadUser(userId);
    }
  }, [open, mode, userId]);

  const loadUser = async (id) => {
    try {
        setLoading(true);
        // const { data } = await usersService.getById(id);
        // form.setFieldsValue(data);
    } finally {
        setLoading(false);
    }
    };


  const handleSubmit = async () => {
    try{
      try {
        await form.validateFields();
        setLoad(true);
      } catch {
        // есть ошибки
        toast.info(t('toasts.fields_required'));
        return;
      }
      const values = await form.validateFields();
      
      const payload = {
        name: values.name,
        received: values.received ? values.received.format('YYYY-MM-DD') : null,
        expired: values.expired ? values.expired.format('YYYY-MM-DD') : null,
      };

      const formData = new FormData();

      // JSON как string
      formData.append('data', JSON.stringify(payload));

      // Отправка формы
    //   const result = await certService.createCertificate(formData);
    //   if (result) {
    //     setModalOpen(false);
    //     form.resetFields();
    //     toast.success(t('response_result.certificate.create'));
    //   }
    }catch(error){
      const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Server error';
      toast.warning(message);
    }finally{
      if (onSuccess) {
          onSuccess(); 
        }
      setLoad(false);
    }
  };

  return (
    <Modal 
      title={t('actions.profile')}
      open={open} 
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
          <Form.Item label={t('fields.user_name')} name="name" rules={[{ required: true, message: t('error_fields.certificate.name') }]}>
            <Input disabled={loading} placeholder={t('fields.user_name')} />
          </Form.Item>
        </Flex>

        <Divider variant="solid"/>
        <h3>{t('fields.user_password')}</h3>
        <Flex direction="column" gap={7} horizontal>
            <Form.Item label={t('fields.password')} name="received" rules={[{ required: true, message: t('error_fields.certificate.received') }]}>
              <Input disabled={loading} placeholder={t('fields.password')} />
            </Form.Item>
            <Form.Item label={t('fields.user_password_confirm')} name="expired" rules={[{ required: true, message: t('error_fields.certificate.expired') }]}>
              <Input disabled={loading} placeholder={t('fields.user_password_confirm')} />
            </Form.Item>
        </Flex>

      </Form>
    </Modal>
  )
}

