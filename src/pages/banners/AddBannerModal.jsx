import { Form, Modal, Input, Tabs, Image, Flex, Space, Divider, Switch, Upload, Checkbox, Tooltip } from "antd";
import { Info, InfoIcon, LucideInfo, PlusCircleIcon } from "lucide-react";
import { useState } from "react";




export default function AddBannerModal({ modalOpen, setModalOpen }) {

  const [form] = Form.useForm();
  const [active, setActive] = useState(true);
  const [customLink, setCustomLink] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [order, setOrder] = useState(0);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');




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
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <Flex direction="column" align="center" gap={2} vertical>
        <PlusCircleIcon size={32} className="text-gray-400" />
        <div style={{ marginTop: 8 }}>Surat saýla</div>
      </Flex>
    </button>
  );

  const handleBeforeUpload = (file) => {
      setFileList([file]);
      return false;
    };

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
          <Form.Item name="nametm">
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>Ady</Space.Addon>
              <Input title="Ady" maxLength={150} showCount name="name" width={'100%'} placeholder="Ady ýazyň (TM)" />
            </Space.Compact>
          </Form.Item>

          <Form.Item name="titletm">
            <Space.Compact style={{ display: 'flex' }}>
              <Space.Addon>Title</Space.Addon>
              <Input title="Title" maxLength={250} showCount name="title" width={'100%'} placeholder="Title ýazyň (TM)" />
            </Space.Compact>
          </Form.Item>

          <Form.Item name="desctm">
            <Input.TextArea maxLength={500} showCount title="Düşündiriş" placeholder="Düşündirişini ýazyň (TM)" />
          </Form.Item>

          <Form.Item name="imagetm">
              <Upload
                listType="picture-card"
                fileList={fileList}
                maxCount={1}
                accept={'.jpg,.jpeg,.png,.webp'}
                beforeUpload={handleBeforeUpload}
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
      children: 'Content of tabs RU'
    }
  ];

  return (
    <Modal 
      title="Banner goşmak" 
      open={modalOpen} 
      onCancel={() => setModalOpen(false)} 
      onOk={() => {}}
      centered 
      closable={false}
      wrapProps={{ onClick: e => e.stopPropagation() }}
      okText="Goşmak">
      <p>Banner goşmak üçin maglumatlary giriziň</p>
      <Form form={form} layout="vertical">
        <Tabs defaultActiveKey="1" items={tabItems}/>
        <Divider />
        <Flex direction="column" gap={7} vertical>
          <Flex direction="column" align="center" gap={5} horizontal>
            <Checkbox checked={customLink} onChange={e => setCustomLink(e.target.checked)}>Başga saýt</Checkbox>
            <Tooltip title="Başga saýt - ulanyjy bannere basanda saýtdan siziň bellän linkiňize ugradylar, eger-de ýok bolsa, standart linke ugradylar">
              <InfoIcon className="text-primary" size={16} />
            </Tooltip>
          </Flex>
          <Form.Item name="link">
            <Input placeholder={customLink ? 'https://sizinlinkiniz': '/sizinlinkiniz'} type="text" />
          </Form.Item>

          <Form.Item label="Tertip sany" name="order">
            <Input placeholder="Tertip sany" type="number" value={order} onChange={e => setOrder(e.target.value)} />
          </Form.Item>
        </Flex>
        <Flex direction="column" gap={5} horizontal>
          <Switch checked={active} onChange={setActive} /> <span>Aktiw</span>
        </Flex>
      </Form>
    </Modal>
  )
}