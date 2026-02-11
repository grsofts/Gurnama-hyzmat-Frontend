import { Table, Image, Tag, Dropdown, Button } from "antd";
import Column from "antd/es/table/Column";
import { EllipsisVertical, Pencil, Trash, CircleX, CircleCheck } from "lucide-react";
import http from "../../../api/http";
import { formatDateTime } from '../../../utils/utils';
import placeholder from '../../../assets/placeholder.jpg';

const ProjectsTable = ({ data, loading, onAction, t, totalProjects }) => {
  const getMenuItems = (record) => [
    {
      key: "set_active",
      label: record.is_active ? t('actions.set_inactive') : t('actions.set_active'),
      icon: record.is_active ? <CircleX size={16}/> : <CircleCheck size={16}/>,
      danger: !!record.is_active,
      disabled: totalProjects.filter(b => b.is_active).length === 1 && record.is_active,
    },
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
      disabled: totalProjects.filter(b => b.is_active).length === 1 && record.is_active,
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
        dataIndex="images" 
        width={120} 
        render={(img) => (
          <Image 
            src={`${http.defaults.baseURL}/uploads/${img[0]?.image_url}`} 
            width={100} 
            fallback={placeholder}
            preview={img != undefined}
            style={{ borderRadius: 8 }} 
          />
        )} 
      />
      <Column title={t('column.title')} dataIndex="title" />
      <Column title={t('column.short_desc')} dataIndex="short_desc" />
      <Column title={t('fields.client_address')} dataIndex="address" />
      <Column 
        title={t('column.status')} 
        dataIndex="is_active" 
        render={(status) => (
          status 
            ? <Tag color="green" variant="outlined">{t('status.active')}</Tag> 
            : <Tag color="red" variant="outlined">{t('status.inactive')}</Tag>
        )} 
      />
      <Column title={t('fields.completed_date')} dataIndex="completed" render={formatDateTime} />
      <Column title={t('column.order')} dataIndex="sort_order" />
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

export default ProjectsTable;