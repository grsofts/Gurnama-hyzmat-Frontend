import { Button, Table, Flex, Input, Space, Tag, Dropdown, Typography, Modal } from "antd";
import { useEffect, useState } from "react";
import userService from "../../api/users.service";
import { EllipsisVertical, Pencil, PlusIcon, Trash } from "lucide-react";
import Column from "antd/es/table/Column";
import { formatDateTime } from '../../utils/utils'
import ModalProfile from "../../components/ModalProfile";
import { useTranslation } from "react-i18next";
import { toast } from "../../utils/toast";


export default function Users() {
  const {t} = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ modal, setModal] = useState({open:false, mode:null, userId:null})

  useEffect( () => {
    loadUsers();
  }, []);

  const closeModal = () => {
    setModal({ open: false, mode: null, userId: null });
  };

  const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Ошибка загрузки пользователей", err);
      } finally {
        setLoading(false);
      }
    };

    const showDeleteAction = (record)=>{
       Modal.confirm({
        title: t('buttons.confirm'),
        content: t('confirmation.delete'),
        okText: t('buttons.confirm'),
        okType: 'danger',
        onOk: async () => {
          try {
            const result = await userService.deleteUser(record);
            if (result) {
              toast.success(t('response_result.user.delete'));
              loadUsers();
            }
          } catch (err) {
            toast.error(err?.response?.data?.message || 'Server error' + err);
          }
        },
      });
    }

  return (
    <Flex className=" rounded-xl">
      <ModalProfile modal={modal} onClose={closeModal} onSuccess={loadUsers} />

        <Flex gap={"middle"} className="p-3 w-full" vertical>
          <Flex gap={"large"} align={"center"}>
              <Typography.Title level={4} style={{ margin: 0 }} strong>
                Ulanyjylar
              </Typography.Title>
              <div className="flex-1"/>
              <Button onClick={() => setModal({ ...modal, open: true, mode: 'create' })} size="large" color="primary" className="gap-0.5" variant="solid"><PlusIcon/><span>Täze ulanyjy goş</span></Button>
          </Flex>
        <Table size="small" bordered="true" dataSource={users} pagination={{ hideOnSinglePage: true }} loading={loading} showSorterTooltip={{ target: 'sorter-icon' }}>
            <Column title="Login" dataIndex="login" key="login" sorter={(a, b) => a.login.length - b.login.length} showSorterTooltip={{ title: 'Login boýunça tertiple', placement: 'top', color: 'blue', target: 'full-header' }} />
            <Column title="Ulanyjy ady" dataIndex="name" key="username" />
            <Column title="Status" dataIndex="is_active" key="is_active" render={(status) => (status ? <Tag color="green" variant="outlined">Aktiw</Tag> : <Tag color="red" variant="outlined">Öçük</Tag>)} />
            
            <Column title="Doredildi" dataIndex="createdAt" key="created" render={(val) => formatDateTime(val)} />
            <Column title="Üýtgedildi" dataIndex="updatedAt" key="updated" render={(val) => formatDateTime(val)} />
            <Column title="Hereketler" key="actions" render={(_, record) => (
               <Dropdown
                  menu={{
                  items: [
                    {
                      key: "edit",
                      label: "Üýtgetmek",
                      icon: <Pencil size={16}/>,
                    },
                    {
                      key: "delete",
                      label: "Ýok etmek",
                      icon: <Trash size={16}/>,
                      danger: true,
                      disabled: record.login === "admin",
                    },
                  ],
                  onClick: ({ key }) => {
                    if (key === "edit") {
                      setModal({...modal,open:true, mode:'edit-user', userId:record.id});
                    }

                    if (key === "delete") {
                      showDeleteAction(record.id);
                    }
                  },
                }}
                  trigger={["click"]}
                  placement="topCenter"
                >
                  <Button
                    size="small"
                    type="text"
                    icon={<EllipsisVertical size={16} />}
                  />
                </Dropdown>
            )} />
            
          </Table>
        </Flex>
    </Flex>
  )
};