import { Table, Image, Dropdown, Button } from "antd";
import Column from "antd/es/table/Column";
import { EllipsisVertical, Pencil, Trash, } from "lucide-react";
import http from "../../../api/http";
import { formatDateTime } from '../../../utils/utils';
import placeholder from '../../../assets/placeholder.jpg';

const ContactsTable = ({ data, loading, onAction, t }) => {
  const getMenuItems = () => [
    {
      key: "edit",
      label: t('actions.edit'),
      icon: <Pencil size={16}/>
    },
    {
      key: "delete",
      label: t('actions.delete'),
      icon: <Trash size={16}/>,
      danger: true,
    },
  ];
  return (
    <Table 
      size="small" 
      dataSource={data} 
      loading={loading} 
      rowKey="id"
      pagination={{ hideOnSinglePage: true }}
    >
      <Column title="№" width={50} render={(_, __, index) => index + 1} />
      <Column 
        title={t('column.image')} 
        dataIndex="icon" 
        width={120} 
        render={(img) => (
          <Image 
            src={`${http.defaults.baseURL}/uploads/${img}`} 
            width={30} 
            fallback={placeholder}
            preview={img != undefined}
            style={{ borderRadius: 8, backgroundColor: '#fff', padding: 4 }} 
          />
        )} 
      />
      <Column title={t('column.title')} dataIndex="title" />
      <Column title={t('column.value')} dataIndex="value" />
      <Column title={t('column.created_at')} dataIndex="createdAt" render={formatDateTime} />
      <Column title={t('column.order')} dataIndex="order" />
      <Column 
        title={t('column.action')} 
        render={(record) => (
          <Dropdown
            menu={{ items: getMenuItems(record), onClick: ({ key }) => onAction(key, record) }}
            trigger={["click"]}
            placement="topCenter"
          >
            <Button size="small" type="text" icon={<EllipsisVertical size={16} />} />
          </Dropdown>
        )} 
      />
    </Table>
  );
};

export default ContactsTable;