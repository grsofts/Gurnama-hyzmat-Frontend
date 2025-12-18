import { Button, Table, Flex, Input, Space, Tag, Dropdown, Typography } from "antd";
import { useEffect, useState } from "react";
import userService from "../../api/users.service";
import { EllipsisVertical, Pencil, PlusIcon, Trash } from "lucide-react";
import Column from "antd/es/table/Column";
import { formatDateTime } from '../../utils/utils'


export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

  const [ search, setSearch ] = useState('');

  const searchData = (e) => {
    setSearch(e.target.value);
  }

  useEffect( () => {
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

  loadUsers();
  }, []);


  return (
    <Flex className=" rounded-xl">
        <Flex gap={"middle"} className="p-3 w-full" vertical>
          <Flex gap={"large"} align={"center"}>
              <Typography.Title level={4} style={{ margin: 0 }} strong>
                Ulanyjylar
              </Typography.Title>
              <div className="flex-1"/>
              <Input variant="filled" size="large" style={{ width: 300 }} allowClear type={"text"} placeholder="Gözleg.." value={search} onChange={searchData}/>
              <Button size="large" color="primary" className="gap-0.5" variant="solid"><PlusIcon/><span>Täze ulanyjy goş</span></Button>
          </Flex>
          <Table size="small" bordered="true" dataSource={users} loading={loading} showSorterTooltip={{ target: 'sorter-icon' }}>
            <Column title="Login" dataIndex="login" key="login" sorter={(a, b) => a.login.length - b.login.length} showSorterTooltip={{ title: 'Login boýunça tertiple', placement: 'top', color: 'blue', target: 'full-header' }} />
            <Column title="Ulanyjy ady" dataIndex="name" key="username" />
            <Column title="Status" dataIndex="is_active" key="is_active" render={(status) => (status ? <Tag color="#00b300" variant="outlined">Aktiw</Tag> : <Tag color="#ff4d4f" variant="outlined">Öçük</Tag>)} />
            
            <Column title="Doredildi" dataIndex="createdAt" key="created" render={(val) => formatDateTime(val)} />
            <Column title="Üýtgedildi" dataIndex="updatedAt" key="updated" render={(val) => formatDateTime(val)} />
            <Column title="Hereketler" key="actions" render={(_, record) => (
               <Dropdown
                  menu={{
                  items: [
                    {
                      key: "edit",
                      label: "Üýtgetmek",
                      icon: <Pencil size={16}/>
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
                      console.log("Edit user:", record);
                    }

                    if (key === "delete") {
                      console.log("Delete user:", record);
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