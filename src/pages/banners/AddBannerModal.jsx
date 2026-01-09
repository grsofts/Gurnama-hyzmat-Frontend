import { Form, Modal, Input, Tabs, Image, Flex, Space, Divider, Switch, Upload, Checkbox, Tooltip } from "antd";
import { Info, InfoIcon, LucideInfo, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import bannersService from "../../api/banners.service";
import { toast } from "../../utils/toast";





export default function AddBannerModal({ modalOpen, setModalOpen }) {

  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState(true);
  const [customLink, setCustomLink] = useState(false);
  const [images, setImages] = useState({tm:[], ru:[], en:[]});
  const [order, setOrder] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fieldsDone, setFieldsDone] = useState(false);


  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });

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
      if(!fieldsDone){
        toast.info('Hemme fieldleri dolduryn');
        return;
      }
      setLoad(true);
      toast.loading('добавляется');
      try {
        await form.validateFields();
        // форма валидна
        setFieldsDone(true);
      } catch {
        // есть ошибки
        setFieldsDone(false);
        toast.info('Заполните обязательные поля');
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
      // const result = await bannersService.createBanner(formData);
      // console.log('Server Response:', result);
      // // Закрыть модалку и сбросить форму
      // if (result) {
      //   setModalOpen(false);
      //   form.resetFields();
      //   setImages({ tm: [], ru: [], en: [] });
      //   setOrder(0);
      //   setActive(true);
      //   setCustomLink(false);
      // }
    }catch(error){
      const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Server error';
      toast.warning(message);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <Flex direction="column" align="center" gap={2} vertical>
        <PlusCircleIcon size={32} className="text-gray-400" />
        <div style={{ marginTop: 8 }}>Surat saýla</div>
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
          <Form.Item name={['translation', 'tm', 'name']} required>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>Ady</Space.Addon>
              <Input disabled={load} required title="Ady" maxLength={150} showCount name="name" width={'100%'} placeholder="Ady ýazyň (TM)" />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'tm', 'title']} required>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>Title</Space.Addon>
              <Input disabled={load} required title="Title" maxLength={250} showCount name="title" width={'100%'} placeholder="Title ýazyň (TM)" />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'tm', 'desc']}>
            <Input.TextArea disabled={load} required maxLength={500} showCount title="Düşündiriş" placeholder="Düşündirişini ýazyň (TM)" />
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
          <Form.Item name={['translation', 'ru', 'name']} required>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>Ady</Space.Addon>
              <Input title="Ady" disabled={load} required maxLength={150} showCount name="name" width={'100%'} placeholder="Ady ýazyň (RU)" />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'ru', 'title']} required>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>Title</Space.Addon>
              <Input title="Title" disabled={load} maxLength={250} showCount name="title" width={'100%'} placeholder="Title ýazyň (RU)" />
            </Space.Compact>
          </Form.Item>

          <Form.Item required name={['translation', 'ru', 'desc']}>
            <Input.TextArea required disabled={load} maxLength={500} showCount title="Düşündiriş" placeholder="Düşündirişini ýazyň (RU)" />
          </Form.Item>

          <Form.Item name='image_ru' required>
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
          <Form.Item name={['translation', 'en', 'name']}>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>Ady</Space.Addon>
              <Input required disabled={load} title="Ady" maxLength={150} showCount name="name" width={'100%'} placeholder="Ady ýazyň (EN)" />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'en', 'title']}>
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>Title</Space.Addon>
              <Input required disabled={load} title="Title" maxLength={250} showCount name="title" width={'100%'} placeholder="Title ýazyň (EN)" />
            </Space.Compact>
          </Form.Item>

          <Form.Item name={['translation', 'en', 'desc']}>
            <Input.TextArea required disabled={load} maxLength={500} showCount title="Düşündiriş" placeholder="Düşündirişini ýazyň (EN)" />
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

  const checkFields = () =>{
    
    if(!form.getFieldValue(['translation', 'tm', 'name']) && !form.getFieldValue(['translation', 'tm', 'title']) && !form.getFieldValue(['translation', 'tm', 'desc'])) {
      setFieldsDone(true);
    } else {
      setFieldsDone(false);
    }
    console.log('Done:',fieldsDone);
    
  }

  return (
    <Modal 
      title="Banner goşmak" 
      open={modalOpen} 
      onCancel={() => setModalOpen(false)} 
      onOk={handleSubmit}
      centered 
      cancelButtonProps={{hidden:load}}
      confirmLoading={load}
      okButtonProps={{disabled:form.getFieldsError().some(({ errors }) => errors.length) || images.tm.length === 0 || images.ru.length === 0 || images.en.length === 0}}
      closable={false}
      wrapProps={{ onClick: e => e.stopPropagation() }}
      okText="Goşmak">
      <p>Banner goşmak üçin maglumatlary giriziň</p>
      <Form form={form} layout="vertical" onChange={checkFields}>
        <Tabs defaultActiveKey="1" items={tabItems}/>
        <Divider />
        <Flex direction="column" gap={7} vertical>
          <Flex direction="column" align="center" gap={5} horizontal>
            <Checkbox  disabled={load} checked={customLink} onChange={e => setCustomLink(e.target.checked)}>Başga saýt</Checkbox>
            <Tooltip title="Başga saýt - ulanyjy bannere basanda saýtdan siziň bellän linkiňize ugradylar, eger-de ýok bolsa, standart linke ugradylar">
              <InfoIcon className="text-primary" size={16} />
            </Tooltip>
          </Flex>
          <Form.Item name="link">
            <Input disabled={load} placeholder={customLink ? 'https://sizinlinkiniz': '/sizinlinkiniz'} type="text" />
          </Form.Item>

          <Form.Item label="Tertip sany" name="order" required>
            <Input disabled={load} placeholder="Tertip sany" type="number" value={order} onChange={e => setOrder(e.target.value)} />
          </Form.Item>
        </Flex>
        <Flex direction="column" gap={5} horizontal>
          <Switch checked={active} onChange={setActive} disabled={load} /> <span>Aktiw</span>
        </Flex>
      </Form>
    </Modal>
  )
}