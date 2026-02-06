import { Form, Modal, Input, Tabs, Image, Flex, Space, Divider, Switch, Upload, Checkbox, Tooltip, Select } from "antd";
import { Info, InfoIcon, LucideInfo, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import hyzmatService from "../../api/hyzmat.service";
import { toast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { getBase64 } from "../../utils/utils";
import 'quill/dist/quill.snow.css';

export default function ContactModal({ modalOpen, onClose, onSuccess }) {

  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [icon, setIcon] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = () => ({ fileList }) => {
    setIcon(fileList);
  };
  const BeforeUpload = () => (file) => {
    setIcon(file);
    return false; // запрет авто-upload
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
        sort_order: Number(values.order),
        translations: values.translation
      };

      const formData = new FormData();

      // JSON как string
      formData.append('data', JSON.stringify(payload));

      // Картинки
      if (icon?.originFileObj) {
        formData.append('icon', icon.originFileObj);
      }

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Отправка формы
      const result = await hyzmatService.createService(formData);
      if (result) {
        onClose();
        form.resetFields();
        setIcon(null);
        toast.success(t('response_result.service.create'));
      }
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

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <Flex direction="column" align="center" gap={2} vertical>
        <PlusCircleIcon size={32} className="text-gray-400" />
        <div style={{ marginTop: 8 }}>{t('placeholders.image')}</div>
      </Flex>
    </button>
  );

  const onTypeChange = value => {
    form.setFieldsValue({ 'type': value });
  };
  

  return (
    <Modal 
      title={ modalOpen.mode === 'add' ? t('add_contact') : t('edit_contact')}
      open={modalOpen.open} 
      onCancel={onClose} 
      onOk={handleSubmit}
      centered 
      width={600}
      cancelButtonProps={{hidden:load}}
      confirmLoading={load}
      okButtonProps={{disabled:form.getFieldsError().some(({ errors }) => errors.length) || icon != null }}
      closable={false}
      wrapProps={{ onClick: e => e.stopPropagation() }}
      okText={t('buttons.save')}>
      <p>{t('please_fill_form_contact')}</p>
      <Form form={form} layout="vertical" initialValues={{ order: 0 }}>
        <Divider />

        <Flex direction="column" gap={3} vertical>

          <Form.Item label={t('fields.title')} name="title" rules={[{ required: true, message: t('placeholders.title') }]}>
            <Input disabled={load} placeholder={t('placeholders.title')} />
          </Form.Item>

          <Form.Item label={t('fields.key')} name="key" rules={[{ required: true, message: t('placeholders.key') }]}>
            <Input disabled={load} placeholder={t('placeholders.key')} />
          </Form.Item>

          <Form.Item label={t('fields.contact_type')} name="type" rules={[{ required: true, message: t('placeholders.contact_type') }]}>
            <Select allowClear disabled={load} placeholder={t('placeholders.contact_type')} options={[
              { value: 'text', label: t('contact_types.text') },
              { value: 'social', label: t('contact_types.social') },
              { value: 'email', label: t('contact_types.email') },
              { value: 'phone', label: t('contact_types.phone') },
            ]} onChange={onTypeChange}/>
          </Form.Item>

          <Form.Item label={t('fields.value')} name="value" rules={[{ required: true, message: t('placeholders.value') }]}>
            <Input disabled={load} placeholder={t('placeholders.value')} />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.type !== cur.type}
          >
            {({ getFieldValue }) =>
              getFieldValue('type') === 'social' ? (
                <Form.Item
                  label={t('fields.link')}
                  name="link"
                  rules={[{ required: true, message: t('error_fields.about.contact_link') }]}
                >
                  <Input disabled={load} placeholder={t('placeholders.contact_link')} />
                </Form.Item>
              ) : null
            }
          </Form.Item>


          <Form.Item label={t('fields.order')} name="order" rules={[{ required: true, message: t('placeholders.order') }]}>
            <Input disabled={load} placeholder={t('placeholders.order')} type="number"/>
          </Form.Item>
        </Flex>
        
        <Form.Item label={t('fields.icon')} name='icon'>
              <Upload
                listType="picture-card"
                fileList={icon ? [icon] : []}
                maxCount={1}
                disabled={load}
                accept={'.png,.svg'}
                beforeUpload={BeforeUpload}
                onPreview={handlePreview}
                onChange={handleChange()}
              >
                {icon ? null : uploadButton}
                </Upload>
                  {previewImage && (
                  <Image
                    styles={{ root: { display: 'none' } }}
                    preview={{
                      open: previewOpen,
                      onOpenChange: visible => setPreviewOpen(visible),
                      afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
          </Form.Item>
      </Form>
    </Modal>
  )
}

