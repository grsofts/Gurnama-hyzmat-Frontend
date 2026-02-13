import { Form, Modal, Input, Image, Flex, Divider, Switch, Upload} from "antd";
import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import partnerService from "../../api/partner.service";
import { toast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { getBase64 } from "../../utils/utils";
import http from "../../api/http";


export default function PartnerModal({ modal, onClose, onSuccess }) {

  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState(true);
  const [images, setImages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(()=>{
    if(!modal.open){
      form.resetFields();
      setImages([]);
      setActive(false);
    }

    if(modal.mode ==='edit' && modal.id){
      //
      const loadPartner = async () => {
        try {
          const data  = await partnerService.getPartnerById(modal.id);
          
          form.setFieldsValue({
            name: data.name,
            link: data.link,
            sort_order: new Number(data.sort_order)
          });
          
          setActive(data.is_active);
          if (data.image) {
            setImages([{
              uid: '-1',
              status: "done",
              url: http.defaults.baseURL + "/uploads" + data.image,
            }]);
          }
        } catch (error) {
          console.error("Ошибка загрузки проекта", error);
        }
      };

      loadPartner();
    }
  },[modal, form])

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
        sort_order: Number(values.sort_order),
        name: values.name,
        link: values.link
      };

      const formData = new FormData();

      // JSON как string
      formData.append('data', JSON.stringify(payload));

      // Картинки
      if (images[0]?.originFileObj) {
        formData.append('image', images[0].originFileObj);
      }

      // Отправка формы
      if(modal.mode === 'crete'){
        //create
        await partnerService.createPartner(formData);
      }else{
        //update
        await partnerService.updatePartner(modal.id, formData);
      }
      
      toast.success(t(modal.mode === 'create' ?'response_result.partner.create':'response_result.partner.update'));
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

  return (
    <Modal 
      title={modal.mode === 'create' ? t('add_partner') : t('edit_partner')}
      open={modal.open} 
      onCancel={onClose} 
      onOk={handleSubmit}
      centered 
      cancelButtonProps={{hidden:load}}
      confirmLoading={load}
      okButtonProps={{disabled:form.getFieldsError().some(({ errors }) => errors.length) || images.length === 0}}
      closable={false}
      wrapProps={{ onClick: e => e.stopPropagation() }}
      okText={t('buttons.save')}>
        {
          modal.mode === 'create' && (
            <p>{t('please_fill_form_certificate')}</p>)
        }
      <Form form={form} layout="vertical" initialValues={{ order: 0 }}>
        
        <Divider />
        <Flex direction="column" gap={7} vertical>
          <Form.Item label={t('fields.name')} name="name" rules={[{ required: true, message: t('error_fields.certificate.name') }]}>
            <Input disabled={load} placeholder={t('placeholders.name')} />
          </Form.Item>

           <Form.Item label={t('placeholders.partner_link')} name="link">
            <Input disabled={load} placeholder={t('placeholders.partner_link')} />
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

        <Form.Item label={t('fields.order')} name="sort_order">
          <Input disabled={load} placeholder={t('placeholders.order')} type="number"/>
        </Form.Item>

        <Flex direction="column" gap={5} horizontal>
          <Switch checked={active} onChange={setActive} disabled={load} /> <span>{t('status.active')}</span>
        </Flex>
      </Form>
    </Modal>
  )
}

