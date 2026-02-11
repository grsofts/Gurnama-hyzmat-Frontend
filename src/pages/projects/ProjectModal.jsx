import { Form, Modal, Input, Tabs, Image, Flex, Space, Select, Divider, Switch, Upload, Checkbox, Tooltip, DatePicker, Rate } from "antd";
import { Info, InfoIcon, LucideInfo, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import projectService from "../../api/project.service";
import { toast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { getBase64 } from "../../utils/utils";
import dayjs from 'dayjs';
import 'quill/dist/quill.snow.css';
import EditorUI from "../../components/ui/EditorUI";
import http from "../../api/http";

export default function ProjectModal({ modal, onClose, onSuccess }) {

  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState(true);
  const [images, setImages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    if (!modal.open) {
      form.resetFields();
      setImages([]);
      setPreviewImage('');
      setPreviewOpen(false);
      setRemovedImages([]);
      setLoad(false);
      return;
    }

    const id = modal.id;
    // Reset preview image when modal is closed
    if (modal.open && modal.mode === 'edit' && id) {

      const loadProject = async () => {
        try {
          const data  = await projectService.getProjectById(id);
          const tagsArray = data.tags
                ? data.tags
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean)
                    .map(t => t.startsWith('#') ? t : `#${t}`)
                : [];
          form.setFieldsValue({
            client_name: data.client_name,
            address: data.address,
            completed: dayjs(data.completed),
            tags: tagsArray,
            rate: data.rate,
            order: new Number(data.sort_order)
          });
           
          form.setFieldValue('translation', {
            tm: { title: data.translations.tm.title, short_desc: data.translations.tm.short_desc, full_desc: data.translations.tm.full_desc },
            ru: { title: data.translations.ru.title, short_desc: data.translations.ru.short_desc, full_desc: data.translations.ru.full_desc },
            en: { title: data.translations.en.title, short_desc: data.translations.en.short_desc, full_desc: data.translations.en.full_desc },
          });

          
          setActive(data.is_active);
          if (data.images) {
            const imageList = data.images.map((image, index) => ({
              uid: index,
              id: image.id,
              name: image.name,
              status: "done",
              url: http.defaults.baseURL + "/uploads" + image.image_url,
            }));
            setImages(imageList);
          }
        } catch (error) {
          console.error("Ошибка загрузки проекта", error);
        }
      };

              

      loadProject();
    }
  }, [modal, form]);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleBeforeUpload = () => false;
  const handleChange = ({file, fileList }) => {
    if (file.status === 'removed' && file.id) {
      setRemovedImages(prev => [...prev, { id: file.id, url: file.url.replace(http.defaults.baseURL + '/uploads', '')}]);
    }
    setImages(fileList);
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
        client_name: values.client_name,
        address: values.address,
        completed: values.completed.format('YYYY-MM-DD'),
        tags: values.tags ? values.tags.map(t => t.startsWith("#") ? t : `#${t}`).join(',') : '',
        rate: values.rate,
        translations: values.translation,
        removed_images: removedImages,
      };

      const formData = new FormData();

      // JSON как string
      formData.append('data', JSON.stringify(payload));

      // Картинки
      images.forEach(file => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });

      // Отправка формы
      if(modal.mode === 'edit'){
        await projectService.updateProject(modal.id, formData);
        toast.success(t('response_result.project.update'));
      } else {
        await projectService.createProject(formData);
        toast.success(t('response_result.project.create'));
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
          <Form.Item name={['translation', 'tm', 'title']} rules={[{ required: true, message: t('error_fields.project.name_tm') }]}>
              <Input disabled={load} title={t('fields.name')} maxLength={150} showCount name="name" width={'100%'} placeholder={ `${t('placeholders.name')} (TM)`} />
          </Form.Item>

          <Form.Item name={['translation', 'tm', 'short_desc']}  rules={[{ required: true, message: t('error_fields.service.short_desc_tm') }]}>
              <Input.TextArea disabled={load} title={t('fields.short_desc')} maxLength={250} showCount name="short_desc" width={'100%'} placeholder={ `${t('placeholders.short_desc')} (TM)`} />
          </Form.Item>

          <Form.Item title={t('fields.description')} name={['translation', 'tm', 'full_desc']}>
            <EditorUI placeholder={`${t('placeholders.description')} (TM)`} value={form.getFieldValue(['translation', 'tm', 'full_desc'])} onChange={value => form.setFieldValue(['translation', 'tm', 'full_desc'], value)} radius={8}/>
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
          <Form.Item name={['translation', 'ru', 'title']}  rules={[{ required: true, message: t('error_fields.project.name_ru') }]}>
              <Input title={t('fields.name')} disabled={load} maxLength={150} showCount name="name" width={'100%'} placeholder={`${t('placeholders.name')} (RU)`} />
          </Form.Item>

          <Form.Item name={['translation', 'ru', 'short_desc']}  rules={[{ required: true, message: t('error_fields.service.short_desc_ru') }]}>
            <Input.TextArea disabled={load} title={t('fields.short_desc')} maxLength={500} showCount name="short_desc" width={'100%'} placeholder={`${t('placeholders.short_desc')} (RU)`} />
          </Form.Item>

          <Form.Item name={['translation', 'ru', 'full_desc']}>
            <EditorUI placeholder={`${t('placeholders.description')} (RU)`} value={form.getFieldValue(['translation', 'ru', 'full_desc'])} onChange={value => form.setFieldValue(['translation', 'ru', 'full_desc'], value)} radius={8}/>
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
          <Form.Item name={['translation', 'en', 'title']}  rules={[{ required: true, message: t('error_fields.project.name_en') }]}>
              <Input disabled={load} title={t('fields.name')} maxLength={150} showCount name="name" width={'100%'} placeholder={`${t('placeholders.name')} (EN)`} />
          </Form.Item>

          <Form.Item name={['translation', 'en', 'short_desc']} rules={[{ required: true, message: t('error_fields.service.short_desc_en') }]}>
              <Input.TextArea disabled={load} title={t('fields.short_desc')} maxLength={500} showCount name="short_desc" width={'100%'} placeholder={`${t('placeholders.short_desc')} (EN)`} />
          </Form.Item>

          <Form.Item name={['translation', 'en', 'full_desc']}>
            <EditorUI placeholder={`${t('placeholders.description')} (EN)`} value={form.getFieldValue(['translation', 'en', 'full_desc'])} onChange={value => form.setFieldValue(['translation', 'en', 'full_desc'], value)} radius={8}/>
          </Form.Item>
        </Flex>
      )
    }
  ];


  return (
    <Modal 
      title={modal.mode === 'edit' ? t('edit_project') : t('add_project')}
      open={modal.open} 
      onCancel={onClose} 
      onOk={handleSubmit}
      centered 
      width={1000}
      cancelButtonProps={{hidden:load}}
      confirmLoading={load}
      okButtonProps={{disabled:form.getFieldsError().some(({ errors }) => errors.length) || images.length === 0 }}
      closable={false}
      wrapProps={{ onClick: e => e.stopPropagation() }}
      okText={t('buttons.save')}>
        {
          modal.mode === 'add' ? (
          <p>{t('please_fill_form_project')}</p>
          ) : null
        }
      <Form form={form} layout="vertical" initialValues={{ order: 0 }}>
        <Divider />
        <Form.Item  >
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon className="" style={{flexShrink: 0}}>{t('fields.client_name')}</Space.Addon>
              <Form.Item name={'client_name'} noStyle>
                <Input disabled={load} title={t('fields.client_name')} maxLength={100} showCount name="client_name" width={'100%'} placeholder={`${t('placeholders.client_name')}`} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
           <Form.Item>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon style={{flexShrink: 0}}>{t('fields.client_address')}</Space.Addon>
              <Form.Item name={'address'} noStyle>
                <Input disabled={load} title={t('fields.client_address')} maxLength={200} showCount name="address" width={'100%'} placeholder={`${t('placeholders.client_address')}`} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Flex align="center" flex={2} horizontal gap={3}>
            <Form.Item label={t('fields.completed_date')} style={{flex:1}} name="completed" rules={[{ required: true, message: t('error_fields.project.completed_date') }]}>
              <DatePicker disabled={load} placeholder={t('fields.completed_date')} format={'DD.MM.YYYY'}/>
            </Form.Item>
            <Form.Item label={t('fields.rate')} name="rate" style={{flex:1}} rules={[{ required: true, message: t('error_fields.project.rate') }]}>
              <Rate />
            </Form.Item>
          </Flex>
          
          <Form.Item label={t('fields.tags')} name="tags" rules={[{ required: true, message: t('error_fields.project.tags') }]}>
          <Select
            mode="tags"
            placeholder={t('placeholders.tags')}
            tokenSeparators={[' ']}
            onChange={(values) =>
              form.setFieldValue(
                "tags",
                values.map(v => v.startsWith("#") ? v : `#${v}`)
              )
            }
          />
        </Form.Item>

        <Tabs defaultActiveKey="1" items={tabItems}/>
        <Divider />

        <Form.Item name='image'>
          <Flex>
            <Upload
              listType="picture-card"
              fileList={images}
              maxCount={5} multiple
              disabled={load}
              accept={'.jpg,.jpeg,.png,.webp'}
              beforeUpload={handleBeforeUpload}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {images.length >= 5 ? null : uploadButton}
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
          </Flex>
        </Form.Item>
        <Flex direction="column" gap={7} vertical>
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

