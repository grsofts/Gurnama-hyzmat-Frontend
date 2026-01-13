import { Form, Modal, Input, Tabs, Image, Flex, Space, Divider, Switch, Upload, Checkbox, Tooltip } from "antd";
import { Info, InfoIcon, LucideInfo, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import bannersService from "../../api/banners.service";
import { toast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { getBase64 } from "../../utils/utils";


export default function AddBannerModal({ modalOpen, setModalOpen, onSuccess }) {

  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState(true);
  const [customLink, setCustomLink] = useState(false);
  const [images, setImages] = useState({tm:[], ru:[], en:[]});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');


  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = (lang) => ({ fileList }) => {
    setImages(prev => ({
      ...prev,
      [lang]: fileList
    }));
  };
  const handleBeforeUpload = (lang) => (file) => {
    setImages(prev => ({
      ...prev,
      [lang]: [file]
    }));
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
        is_active: active,
        link: values.link,
        is_custom_link: customLink,
        translations: values.translation
      };

      const formData = new FormData();

      // JSON как string
      formData.append('data', JSON.stringify(payload));

      // Картинки
      if (images.tm?.[0]?.originFileObj) {
        formData.append('image_tm', images.tm[0].originFileObj);
      }

      if (images.ru?.[0]?.originFileObj) {
        formData.append('image_ru', images.ru[0].originFileObj);
      }

      if (images.en?.[0]?.originFileObj) {
        formData.append('image_en', images.en[0].originFileObj);
      }

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Отправка формы
      const result = await bannersService.createBanner(formData);
      if (result) {
        setModalOpen(false);
        form.resetFields();
        setImages({ tm: [], ru: [], en: [] });
        setActive(true);
        setCustomLink(false);
        toast.success(t('response_result.banner.create'));
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

  const tabItems = [
    {
      key: 1,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Image
              src={`/flags/tm.png`}
              width={20}
              preview={false}
              className="me-2"
            />  <span>Türkmençe</span>
        </span>
          ),
      children: (
        <Flex direction="column" gap={2} vertical>
          <Form.Item name={['translation', 'tm', 'name']} rules={[{ required: true, message: t('error_fields.banner.name_tm') }]}>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>{t('fields.name')}</Space.Addon>
              <Input disabled={load} title={t('fields.name')} maxLength={150} showCount name="name" width={'100%'} placeholder={ `${t('placeholders.name')} (TM)`} />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'tm', 'title']}  rules={[{ required: true, message: t('error_fields.banner.title_tm') }]}>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>{t('fields.title')}</Space.Addon>
              <Input disabled={load} title={t('fields.title')} maxLength={250} showCount name="title" width={'100%'} placeholder={ `${t('placeholders.title')} (TM)`} />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'tm', 'desc']}>
            <Input.TextArea disabled={load} required maxLength={500} showCount title={t('fields.description')} placeholder={ `${t('placeholders.description')} (TM)`} />
          </Form.Item>

          <Form.Item name='image_tm'>
              <Upload
                listType="picture-card"
                fileList={images.tm}
                maxCount={1}
                disabled={load}
                accept={'.jpg,.jpeg,.png,.webp'}
                beforeUpload={handleBeforeUpload('tm')}
                onPreview={handlePreview}
                onChange={handleChange('tm')}
              >
                {images.tm.length >= 1 ? null : uploadButton}
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
        </Flex>
      )
    },
    {
      key: 2,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Image
              src={`/flags/ru.png`}
              width={20}
              preview={false}
              className="me-2"
            />  <span>Русский</span>
        </span>
          ),
      children: (
        <Flex direction="column" gap={1} vertical>
          <Form.Item name={['translation', 'ru', 'name']}  rules={[{ required: true, message: t('error_fields.banner.name_ru') }]}>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>{t('fields.name')}</Space.Addon>
              <Input title={t('fields.name')} disabled={load} maxLength={150} showCount name="name" width={'100%'} placeholder={`${t('placeholders.name')} (RU)`} />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'ru', 'title']}  rules={[{ required: true, message: t('error_fields.banner.title_ru') }]}>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>{t('fields.title')}</Space.Addon>
              <Input title={t('fields.title')} disabled={load} maxLength={250} showCount name="title" width={'100%'} placeholder={`${t('placeholders.title')} (RU)`} />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'ru', 'desc']}>
            <Input.TextArea disabled={load} maxLength={500} showCount title={t('fields.description')} placeholder={`${t('placeholders.description')} (RU)`} />
          </Form.Item>

          <Form.Item name='image_ru'>
              <Upload
                listType="picture-card"
                fileList={images.ru}
                maxCount={1} disabled={load}
                accept={'.jpg,.jpeg,.png,.webp'}
                beforeUpload={handleBeforeUpload('ru')}
                onPreview={handlePreview}
                onChange={handleChange('ru')}
              >
                {images.ru.length >= 1 ? null : uploadButton}
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
        </Flex>
      )
    },
    {
      key: 3,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Image
              src={`/flags/us.png`}
              width={20}
              preview={false}
              className="me-2"
            />  <span>English</span>
        </span>
          ),
      children: (
        <Flex direction="column" gap={2} vertical>
          <Form.Item name={['translation', 'en', 'name']}  rules={[{ required: true, message: t('error_fields.banner.name_en') }]}>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>{t('fields.name')}</Space.Addon>
              <Input disabled={load} title={t('fields.name')} maxLength={150} showCount name="name" width={'100%'} placeholder={`${t('placeholders.name')} (EN)`} />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'en', 'title']}  rules={[{ required: true, message: t('error_fields.banner.title_en') }]}>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>{t('fields.title')}</Space.Addon>
              <Input disabled={load} title={t('fields.title')} maxLength={250} showCount name="title" width={'100%'} placeholder={`${t('placeholders.title')} (EN)`} />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'en', 'desc']}>
            <Input.TextArea disabled={load} maxLength={500} showCount title={t('fields.description')} placeholder={`${t('placeholders.description')} (EN)`} />
          </Form.Item>

          <Form.Item name='image_en'>
              <Upload
                listType="picture-card"
                fileList={images.en}
                maxCount={1}
                disabled={load}
                accept={'.jpg,.jpeg,.png,.webp'}
                beforeUpload={handleBeforeUpload('en')}
                onPreview={handlePreview}
                onChange={handleChange('en')}
              >
                {images.en.length >= 1 ? null : uploadButton}
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
        </Flex>
      )
    }
  ];


  return (
    <Modal 
      title={t('add_banner')}
      open={modalOpen} 
      onCancel={() => setModalOpen(false)} 
      onOk={handleSubmit}
      centered 
      cancelButtonProps={{hidden:load}}
      confirmLoading={load}
      okButtonProps={{disabled:form.getFieldsError().some(({ errors }) => errors.length) || images.tm.length === 0 || images.ru.length === 0 || images.en.length === 0}}
      closable={false}
      wrapProps={{ onClick: e => e.stopPropagation() }}
      okText={t('buttons.save')}>
      <p>{t('please_fill_form_banner')}</p>
      <Form form={form} layout="vertical" initialValues={{ order: 0 }}>
        <Tabs defaultActiveKey="1" items={tabItems}/>
        <Divider />
        <Flex direction="column" gap={7} vertical>
          
          <Form.Item name="link" label={t("fields.link")}>
            <Input disabled={load} placeholder={customLink ? `https:/${t('placeholders.your_link')}` : t('placeholders.your_link')} type="text" />
          </Form.Item>

          <Form.Item label={t('fields.order')} name="order" rules={[{ required: true, message: t('placeholders.order') }]}>
            <Input disabled={load} placeholder={t('placeholders.order')} type="number"/>
          </Form.Item>
        </Flex>
        <Flex direction="column" gap={5} horizontal>
          <Switch checked={active} onChange={setActive} disabled={load} /> <span>{t('status.active')}</span>
        </Flex>
      </Form>
    </Modal>
  )
}

