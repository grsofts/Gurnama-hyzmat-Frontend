import { Button, Table, Flex, Input, Space, Tag, Typography, Image, Card, Segmented, DatePicker, Menu, Dropdown } from "antd";

import { useEffect, useState } from "react";
import bannersService from "../../api/banners.service";
import { ActivitySquare, CircleCheck, CircleX, Download, EllipsisVertical, Filter, Pencil, Plus, PlusIcon, Trash } from "lucide-react";
import Column from "antd/es/table/Column";
import { formatDateTime } from '../../utils/utils'
import AddBannerModal from "./AddBannerModal";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import http from "../../api/http";
import Spacer from "../../components/ui/Spacer";


export default function Banners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    // const navigate = useNavigate();

  const [ search, setSearch ] = useState('');

  const searchData = (e) => {
    setSearch(e.target.value);
  }

  useEffect( () => {
    const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await bannersService.getBanners();
      setBanners(data);
    } catch (err) {
      console.error("Ошибка загрузки баннеров", err);
    } finally {
      setLoading(false);
    }
  };

  loadOrders();
  }, []);

  const [modalAddBanner, setModalAddBanner] = useState(false);

const { RangePicker } = DatePicker;


  return (
    <Flex className="rounded-xl">
        <Flex gap={"middle"} className="w-full" vertical>
          <AddBannerModal modalOpen={modalAddBanner} setModalOpen={setModalAddBanner} />
          <Card className="shadow-sm border-0 p-0" styles={{ body:{padding:16}}}>
            <Flex gap={"large"} align={"center"}>
              <Typography.Title level={4} style={{ margin: 0 }} strong>
               {t('menu.banners')}
              </Typography.Title>
              <Spacer/>
              <Input variant="filled" size="large" style={{ width: 300 }} allowClear type={"text"} placeholder="Search.." value={search} onChange={searchData}/>
              <Button size="large" color="primary" className="gap-0.5 shadow-none" variant="solid" onClick={() => setModalAddBanner(true)}><Plus size={20}/><span>{t('buttons.add')}</span></Button>
              {/* <Segmented size="large" options={['Все баннеры', 'Выполненные', 'Отмененные', 'Новые']} /> */}
            </Flex>

          </Card>
          
          {/* <Card className="shadow-sm border-0 p-0" styles={{ body:{padding:16}}}>
            <Flex gap={"large"} align={"center"}>
              
              <Button type="text" color="default" size="large" variant="filled"><Filter size={16}/> Filter</Button>
              <RangePicker type="text" variant="filled" size="large" style={{ width: 190 }} format={{format:'MMM D'}} placeholder={['Начальная дата', 'Конечная дата']} />

              <Spacer/>

              
            </Flex>

          </Card> */}
          <Card className="shadow-sm border-0 p-0" styles={{ body:{padding:16}}}>

          <Table size="small" className="" pagination={{ position: [ "bottomCenter"]}} dataSource={banners} loading={loading} showSorterTooltip={{ target: 'sorter-icon' }} >
            <Column title="№" width={50} key="row_number" responsive={['md', 'lg', 'xl']} render={(_, __, index) => index + 1} />
            <Column title={t('column.image')} dataIndex="image" width={120} key="image" alt="Banner" render={(img) => 
              <Image src={`${http.defaults.baseURL}/uploads/${img}`} width={100} style={{ zIndex: 500, borderRadius: 8 }} preview onClick={(e) => e.stopPropagation} /> } />
            <Column title={t('column.name')} dataIndex="name" key="name" alt="Banner" />
            <Column title={t('column.title')} dataIndex="title" key="title" alt="Banner" />

            <Column title={t('column.status')} dataIndex="is_active" key="is_active" render={(status) => (status ? <Tag color="#00b300" variant="outlined">Aktiw</Tag> : <Tag color="#ff4d4f" variant="outlined">Öçük</Tag>)} />
            <Column title={t('column.created_at')} dataIndex="createdAt" key="createdAt" render={(createdAt) => formatDateTime(createdAt)} />
            <Column title={t('column.action')} key="action" render={(record) => (
              <Dropdown
                  menu={{
                  items: [
                    {
                      key: "set_active",
                      label: record.is_active ? t('actions.set_inactive') : t('actions.set_active'),
                      icon: record.is_active ? <CircleX size={16}/> : <CircleCheck size={16}/>,
                      danger: record.is_active ? true : false,
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
          </Card>
        </Flex>
    </Flex>
  )
};