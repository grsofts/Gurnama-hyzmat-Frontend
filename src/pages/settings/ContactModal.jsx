import { Form, Modal, Input, Image, Flex, Divider, Upload, Select } from "antd";
import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import settingService from "../../api/setting.service";
import { toast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { getBase64 } from "../../utils/utils";
import 'quill/dist/quill.snow.css';
import http from "../../api/http";

export default function ContactModal({ modalOpen, onClose, onSuccess }) {

  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (!modalOpen.open) {
      form.resetFields();
      setFileList([]);
      setPreviewImage('');
      setPreviewOpen(false);
      setLoad(false);
      return;
    }

    const contact = modalOpen.contact;
    // Reset preview image when modal is closed
    if (modalOpen.open && modalOpen.mode === 'edit' && modalOpen.contact) {
      form.setFieldsValue({
        "title": contact.title,
        "key": contact.key,
        "type": contact.type,
        "value": contact.value,
        "link": contact.link,
        "order": contact.order
      });
      if (contact.icon) {
        setFileList([
          {
            uid: "-1",
            name: "icon.svg",
            status: "done",
            url: http.defaults.baseURL + "/uploads" + contact.icon,
          },
        ]);
      }
    }
  }, [modalOpen, form]);

  const handleChange = ({ fileList }) => setFileList(fileList);

  
  const handlePreview = async (file) => {
  if (file.url) {
    setPreviewImage(file.url);
  } else if (file.originFileObj) {
    const base64 = await getBase64(file.originFileObj);
    setPreviewImage(base64);
  }
  setPreviewOpen(true);
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
        order: Number(values.order),
        title: values.title,
        key: values.key,
        type: values.type,
        value: values.value,
        link: values.link || '',
      };

      const formData = new FormData();

      // JSON как string
      formData.append('data', JSON.stringify(payload));

      // Картинки
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("icon", fileList[0].originFileObj);
      }

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Отправка формы
      if(modalOpen.mode === 'edit'){
        await settingService.updateContact(modalOpen.contact.id, formData);
        toast.success(t('response_result.contact.update'));
      } else {
        await settingService.createContact(formData);
        toast.success(t('response_result.contact.create'));
      }
      onClose();
      onSuccess?.();
    }catch(error){
      const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Server error';
      toast.warning(message);
    }finally{
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
      okButtonProps={{disabled:form.getFieldsError().some(({ errors }) => errors.length) || fileList.length === 0 }}
      closable={false}
      wrapProps={{ onClick: e => e.stopPropagation() }}
      okText={t('buttons.save')}>
        {
          modalOpen.mode === 'add' ? (
          <p>{t('please_fill_form_contact')}</p>
        ) : null
        }
      <Form form={form} layout="vertical" initialValues={{ order: 0 }}>
        <Divider />

        <Flex direction="column" gap={3} vertical>

          <Form.Item label={t('fields.title')} name="title" rules={[{ required: true, message: t('placeholders.title') }]}>
            <Input disabled={load} placeholder={t('placeholders.title')} />
          </Form.Item>

          <Form.Item label={t('fields.key')} name="key" rules={[{ required: true,  message: t('placeholders.key') }]}>
            <Input disabled={load} placeholder={t('placeholders.key')} onChange={(e) => {
              const value = e.target.value.replace(/\s+/g, '');
              form.setFieldValue('key', value);
            }} />
          </Form.Item>

          <Form.Item label={t('fields.contact_type')} name="type" rules={[{ required: true, message: t('placeholders.contact_type') }]}>
            <Select allowClear disabled={load} placeholder={t('placeholders.contact_type')} options={[
              { value: 'text', label: t('contact_types.text') },
              { value: 'social', label: t('contact_types.social') },
              { value: 'email', label: t('contact_types.email') },
              { value: 'phone', label: t('contact_types.phone') },
            ]} onChange={onTypeChange}/>
          </Form.Item>

          <Form.Item label={t('fields.value')} name="value" rules={[{ required: true, message: t('placeholders.value') }]} >
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
                fileList={fileList}
                maxCount={1}
                disabled={load}
                accept={'.png,.svg'}
                beforeUpload={()=> false}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 1 ? null : uploadButton}
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

