import { Form, Modal, Input, Tabs, Image, Flex, Space, Divider, Switch, Upload, Checkbox, Tooltip, DatePicker } from "antd";
import { Info, InfoIcon, LucideInfo, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import certService from "../../api/certificate.service";
import { toast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { getBase64 } from "../../utils/utils";


export default function AddCertModal({ modalOpen, setModalOpen, onSuccess }) {

  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState(true);
  const [images, setImages] = useState([]);
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
    setImages(fileList);
  };
  const handleBeforeUpload = () => (file) => {
    setImages([file]);
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
        is_active: active,
        name: values.name,
        received: values.received ? values.received.format('YYYY-MM-DD') : null,
        expired: values.expired ? values.expired.format('YYYY-MM-DD') : null,
      };

      const formData = new FormData();

      // JSON как string
      formData.append('data', JSON.stringify(payload));

      // Картинки
      if (images[0]?.originFileObj) {
        formData.append('image', images[0].originFileObj);
      }

      // Отправка формы
      const result = await certService.createCertificate(formData);
      if (result) {
        setModalOpen(false);
        form.resetFields();
        setImages([]);
        setActive(true);
        toast.success(t('response_result.certificate.create'));
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

  return (
    <Modal 
      title={t('add_certificate')}
      open={modalOpen} 
      onCancel={() => setModalOpen(false)} 
      onOk={handleSubmit}
      centered 
      cancelButtonProps={{hidden:load}}
      confirmLoading={load}
      okButtonProps={{disabled:form.getFieldsError().some(({ errors }) => errors.length) || images.length === 0}}
      closable={false}
      wrapProps={{ onClick: e => e.stopPropagation() }}
      okText={t('buttons.save')}>
      <p>{t('please_fill_form_certificate')}</p>
      <Form form={form} layout="vertical" initialValues={{ order: 0 }}>
        
        <Divider />
        <Flex direction="column" gap={7} vertical>
          <Form.Item label={t('fields.name')} name="name" rules={[{ required: true, message: t('error_fields.certificate.name') }]}>
            <Input disabled={load} placeholder={t('placeholders.name')} />
          </Form.Item>
        </Flex>

        <Form.Item name='image'>
          <Upload
            listType="picture-card"
            fileList={images}
            maxCount={1}
            disabled={load}
            accept={'.jpg,.jpeg,.png,.webp'}
            beforeUpload={handleBeforeUpload()}
            onPreview={handlePreview}
            onChange={handleChange()}
          >
            {images.length >= 1 ? null : uploadButton}
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

        <Flex direction="column" gap={7} horizontal>
            <Form.Item label={t('column.received')} name="received" rules={[{ required: true, message: t('error_fields.certificate.received') }]}>
              <DatePicker disabled={load} placeholder={t('column.received')} />
            </Form.Item>
            <Form.Item label={t('column.expired')} name="expired" rules={[{ required: true, message: t('error_fields.certificate.expired') }]}>
              <DatePicker disabled={load} placeholder={t('column.expired')} />
            </Form.Item>
        </Flex>

        <Flex direction="column" gap={5} horizontal>
          <Switch checked={active} onChange={setActive} disabled={load} /> <span>{t('status.active')}</span>
        </Flex>
      </Form>
    </Modal>
  )
}

