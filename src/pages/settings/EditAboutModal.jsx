import { Form, Modal, Input, Tabs, Image, Flex, Divider, Upload } from "antd";
import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import settingService from "../../api/setting.service";
import { toast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { getBase64 } from "../../utils/utils";
import 'quill/dist/quill.snow.css';
import http from "../../api/http";
import EditorUI from "../../components/ui/EditorUI";

export default function EditAboutModal({ modalOpen, setModalOpen, onSuccess }) {

  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [images, setImages] = useState({small_image: null, large_image: null});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');


  useEffect(() => {
    if (modalOpen) {
      // Fetch about data and populate the form
      const fetchAbout = async () => {
        const result = await settingService.getAllAbout();
        
        form.setFieldValue('translation', {
          tm: { footer_text: result.translations.tm.footer_text, short_text: result.translations.tm.short_text, full_text: result.translations.tm.full_text },
          ru: { footer_text: result.translations.ru.footer_text, short_text: result.translations.ru.short_text, full_text: result.translations.ru.full_text },
          en: { footer_text: result.translations.en.footer_text, short_text: result.translations.en.short_text, full_text: result.translations.en.full_text },
        });

        const initialImages = {
          small_image: result.small_image ? { uid: '-1', name: 'small_image.png', status: 'done', url: `${http.defaults.baseURL}/uploads${result.small_image}` } : null,
          large_image: result.large_image ? { uid: '-2', name: 'large_image.png', status: 'done', url: `${http.defaults.baseURL}/uploads${result.large_image}` } : null,
        };

        setImages(initialImages);
      };
      fetchAbout();
    }
  }, [modalOpen, form]);


  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = (key) => ({ fileList }) => {
    setImages(prev => ({
      ...prev,
      [key]: fileList[0] || null, // ВСЕГДА 1 файл
    }));
  };
  const BeforeUpload = () => false;

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
        translations: values.translation
      };

      const formData = new FormData();

      // JSON как string
      formData.append('data', JSON.stringify(payload));

      // Картинки
      if (images.small_image?.originFileObj) {
        formData.append('small_image', images.small_image.originFileObj);
      }

      if (images.large_image?.originFileObj) {
        formData.append('large_image', images.large_image.originFileObj);
      }

      
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      // Отправка формы
      const result = await settingService.updateAbout(formData);
      if (result) {
        setModalOpen(false);
        form.resetFields();
        setImages({});
        toast.success(t('response_result.about.update'));
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
          <Form.Item label={t('fields.short_text')} name={['translation', 'tm', 'short_text']} rules={[{ required: true, message: t('error_fields.about.short_text_tm') }]}>
            <Input.TextArea disabled={load} title={t('fields.short_text')} maxLength={255} showCount name="short_text" width={'100%'} placeholder={`${t('placeholders.short_text')} (TM)`} />
          </Form.Item>

          <Form.Item label={t('fields.footer_text')} name={['translation', 'tm', 'footer_text']}  rules={[{ required: true, message: t('error_fields.about.footer_text_tm') }]}>
              <Input.TextArea disabled={load} title={t('fields.footer_text')} maxLength={255} showCount name="footer_text" width={'100%'} placeholder={ `${t('placeholders.footer_text')} (TM)`} />
          </Form.Item>

          <Form.Item title={t('fields.full_text')} name={['translation', 'tm', 'full_text']}>
            <EditorUI placeholder={`${t('placeholders.description')} (TM)`} value={form.getFieldValue(['translation', 'tm', 'full_text'])} onChange={value => form.setFieldValue(['translation', 'tm', 'full_text'], value)} radius={8}/>
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
         <Form.Item label={t('fields.short_text')} name={['translation', 'ru', 'short_text']} rules={[{ required: true, message: t('error_fields.about.short_text_ru') }]}>
            <Input.TextArea disabled={load} title={t('fields.short_text')} maxLength={255} showCount name="short_text" width={'100%'} placeholder={`${t('placeholders.short_text')} (RU)`} />
          </Form.Item>

          <Form.Item label={t('fields.footer_text')} name={['translation', 'ru', 'footer_text']}  rules={[{ required: true, message: t('error_fields.about.footer_text_ru') }]}>
              <Input.TextArea disabled={load} title={t('fields.footer_text')} maxLength={255} showCount name="footer_text" width={'100%'} placeholder={ `${t('placeholders.footer_text')} (RU)`} />
          </Form.Item>

          <Form.Item title={t('fields.full_text')} name={['translation', 'ru', 'full_text']}>
            <EditorUI placeholder={`${t('placeholders.description')} (RU)`} value={form.getFieldValue(['translation', 'ru', 'full_text'])} onChange={value => form.setFieldValue(['translation', 'ru', 'full_text'], value)} radius={8}/>
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
          <Form.Item label={t('fields.short_text')} name={['translation', 'en', 'short_text']} rules={[{ required: true, message: t('error_fields.about.short_text_en') }]}>
            <Input.TextArea disabled={load} title={t('fields.short_text')} maxLength={255} showCount name="short_text" width={'100%'} placeholder={`${t('placeholders.short_text')} (EN)`} />
          </Form.Item>

          <Form.Item label={t('fields.footer_text')} name={['translation', 'en', 'footer_text']}  rules={[{ required: true, message: t('error_fields.about.footer_text_en') }]}>
              <Input.TextArea disabled={load} title={t('fields.footer_text')} maxLength={255} showCount name="footer_text" width={'100%'} placeholder={ `${t('placeholders.footer_text')} (EN)`} />
          </Form.Item>

          <Form.Item title={t('fields.full_text')} name={['translation', 'en', 'full_text']}>
            <EditorUI placeholder={`${t('placeholders.description')} (EN)`} value={form.getFieldValue(['translation', 'en', 'full_text'])} onChange={value => form.setFieldValue(['translation', 'en', 'full_text'], value)} radius={8}/>
          </Form.Item>
        </Flex>
      )
    }
  ];


  return (
    <Modal 
      title={t('edit_about')}
      open={modalOpen} 
      onCancel={() => setModalOpen(false)} 
      onOk={handleSubmit}
      centered 
      width={1000}
      cancelButtonProps={{hidden:load}}
      confirmLoading={load}
      okButtonProps={{disabled:form.getFieldsError().some(({ errors }) => errors.length) || images.small_image === 0 || images.large_image === 0}}
      closable={false}
      wrapProps={{ onClick: e => e.stopPropagation() }}
      okText={t('buttons.save')}>
      <Form form={form} layout="vertical" initialValues={{ order: 0 }}>
        <Tabs defaultActiveKey="1" items={tabItems}/>

        <Divider />

        <Form.Item label={t('fields.small_image')} name='small_image'>
              <Upload
                listType="picture-card"
                fileList={images.small_image ? [images.small_image] : []}
                maxCount={1}
                disabled={load}
                accept={'.jpg,.jpeg,.png,.webp'}
                beforeUpload={BeforeUpload}
                onPreview={handlePreview}
                onChange={handleChange('small_image')}
              >
                {images.small_image ? null : uploadButton}
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
          <Form.Item label={t('fields.large_image')} name='large_image'>
              <Upload
                listType="picture-card"
                fileList={images.large_image ? [images.large_image] : []}
                maxCount={1}
                disabled={load}
                accept={'.jpg,.jpeg,.png,.webp'}
                beforeUpload={BeforeUpload}
                onPreview={handlePreview}
                onChange={handleChange('large_image')}
              >
                {images.large_image ? null : uploadButton}
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

