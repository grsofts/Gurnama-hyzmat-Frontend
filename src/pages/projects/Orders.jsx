import { Button, Table, Flex, Input, Space, Tag, Typography, Image, Card, Segmented, DatePicker } from "antd";

import { useEffect, useState } from "react";
//import orderService from "../../api/orders.service";
import { Download, EllipsisVertical, Filter, Pencil, PlusIcon, Trash } from "lucide-react";
import Column from "antd/es/table/Column";
//import { formatDateTime } from '../../utils/utils'
//import http from "../../api/http";
import NewOrderModal from "./NewOrderModal";
import { useNavigate } from "react-router-dom";
import Spacer from "../../components/ui/Spacer";


export default function Orders() {
    //const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

  const [ search, setSearch ] = useState('');

  const searchData = (e) => {
    setSearch(e.target.value);
  }

  useEffect( () => {
    const loadOrders = async () => {
    try {
      setLoading(true);
      //const data = await orderService.getOrders();
      //setOrders(data);
    } catch (err) {
      console.error("Ошибка загрузки заказов", err);
    } finally {
      setLoading(false);
    }
  };

  loadOrders();
  }, []);
  
  const [modalOpen, setModalOpen] = useState(false);

  const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }];

  const rowProps = (record) => ({
        onClick: () => navigate(`/orders/${record.key}`), // или record.key
        style: {
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        onMouseEnter: (e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
        },
        onMouseLeave: (e) => {
            e.currentTarget.style.backgroundColor = '';
        },
    });

const { RangePicker } = DatePicker;


  return (
    <Flex className="rounded-xl">
        <Flex gap={"middle"} className="w-full" vertical>
          <NewOrderModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
          <Card className="shadow-sm border-0 p-0" styles={{ body:{padding:16}}}>
            <Flex gap={"large"} align={"center"}>
              <Typography.Title level={4} style={{ margin: 0 }} strong>
               Заказы
              </Typography.Title>
              <Spacer/>
              <Segmented size="large" options={['Все заказы', 'Выполненные', 'Отмененные', 'Новые']} />
            </Flex>

          </Card>
          
          <Card className="shadow-sm border-0 p-0" styles={{ body:{padding:16}}}>
            <Flex gap={"large"} align={"center"}>
              
              <Input variant="filled" size="large" style={{ width: 300 }} allowClear type={"text"} placeholder="Search.." value={search} onChange={searchData}/>
              <Button type="text" color="default" size="large" variant="filled"><Filter size={16}/> Filter</Button>
              <RangePicker type="text" variant="filled" size="large" style={{ width: 190 }} format={{format:'MMM D'}} placeholder={['Начальная дата', 'Конечная дата']} />

              <Spacer/>

              <Button size="large" color="primary" className="gap-0.5 shadow-none" variant="solid" onClick={() => setModalOpen(true)}><Download size={20}/><span> Экспорт</span></Button>
            </Flex>

          </Card>
          <Card className="shadow-sm border-0 p-0" styles={{ body:{padding:16}}}>

          <Table size="small" className="" pagination={{ position: [ "bottomCenter"]}} dataSource={data} loading={loading} showSorterTooltip={{ target: 'sorter-icon' }} 
            onRow={rowProps}>
            <Column title="№" key="row_number" responsive={['md', 'lg', 'xl']} render={(_, __, index) => index + 1} />
            <Column title="Name" dataIndex="name" key="name" alt="Order" />
            <Column title="Age" dataIndex="age" responsive={['md', 'lg', 'xl']}  key="age" sorter={(a, b) => a.age - b.age} showSorterTooltip={{ title: 'Ady boýunça tertiple', placement: 'top', color: 'blue', target: 'full-header' }} />
            <Column title="Address" dataIndex="address" key="address" />
          </Table>
          </Card>
        </Flex>
    </Flex>
  )
};