import { Button, Table, Flex, Input, Space, Tag, Dropdown, Typography, Image } from "antd";
import { useEffect, useState } from "react";
import bannerService from "../../api/banners.service";
import { EllipsisVertical, Pencil, PlusIcon, Trash } from "lucide-react";
import Column from "antd/es/table/Column";
import { formatDateTime } from '../../utils/utils'
import http from "../../api/http";


export default function Banners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

  const [ search, setSearch ] = useState('');

  const searchData = (e) => {
    setSearch(e.target.value);
  }

  useEffect( () => {
    const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getBanners();
      setBanners(data);
    } catch (err) {
      console.error("Ошибка загрузки баннеров", err);
    } finally {
      setLoading(false);
    }
  };

  loadBanners();
  }, []);


  return (
    <Flex className=" rounded-xl">
        <Flex gap={"middle"} className="p-3 w-full" vertical>
          <Flex gap={"large"} align={"center"}>
              <Typography.Title level={4} style={{ margin: 0 }} strong>
                Bannerler
              </Typography.Title>
              <div className="flex-1"/>
              <Input variant="filled" size="large" style={{ width: 300 }} allowClear type={"text"} placeholder="Gözleg.." value={search} onChange={searchData}/>
              <Button size="large" color="primary" className="gap-0.5" variant="solid"><PlusIcon/><span>Täze banner goş</span></Button>
          </Flex>
          <Table size="small" bordered="true" dataSource={banners} loading={loading} showSorterTooltip={{ target: 'sorter-icon' }}>
            <Column title="№" key="row_number" render={(_, __, index) => index + 1} />
            <Column title="Surat" dataIndex="image" key="image" render={(url) => 
              <Image src={http.defaults.baseURL + "/uploads" + url} alt="Banner" style={{ width: 100, height: 'auto', borderRadius: 8 }} />} />
            <Column title="Ady" dataIndex="name" key="name" sorter={(a, b) => a.name.length - b.name.length} showSorterTooltip={{ title: 'Ady boýunça tertiple', placement: 'top', color: 'blue', target: 'full-header' }} />
            <Column title="Title" dataIndex="title" key="title" />
            <Column title="Dusundiris gysgaca" dataIndex="desc" key="description" />
            <Column title="Status" dataIndex="is_active" key="is_active" render={(status) => (status ? <Tag color="#00b300" variant="outlined">Aktiw</Tag> : <Tag color="#ff4d4f" variant="outlined">Öçük</Tag>)} />
            <Column title="Sort" dataIndex="sort_order" key="sort" />
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
                      disabled: banners.length === 1,
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