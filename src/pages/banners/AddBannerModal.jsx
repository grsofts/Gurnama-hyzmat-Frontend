import { Form, Modal, UploadImage, Input } from "antd";



export default function AddBannerModal() {
  return (
    <Modal title="Banner goşmak" open={false} onCancel={() => {}} onOk={() => {}}>
      <p>Banner goşmak üçin maglumatlary giriziň</p>
      <Form layout="vertical">
        <Form.Item label="Ady" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Surat" name="image">
          <UploadImage />
        </Form.Item>
        <Form.Item label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Düşündiriş" name="desc">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}