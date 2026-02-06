import { Button, Flex, Image, Typography, Card, Modal, Divider, Input } from "antd";
const { Text } = Typography;
import { Pen, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAbout } from "../../hooks/useAbout";
import settingService from "../../api/setting.service";
import { toast } from "../../utils/toast";

import Spacer from "../../components/ui/Spacer";
import ContactTable from "./helper/ContactTable";
import http from "../../api/http";
import placeholder from '../../assets/placeholder.jpg';
import EditAboutModal from "./EditAboutModal";
import ContactModal from "./ContactModal";

export default function Settings() {
  const { t } = useTranslation();
  const { about, loading, loadAbout, contacts, loadContacts } = useAbout();

  const [aboutModalState, setAboutModalState] = useState(false);
  const [contactModalState, setContactModalState] = useState({ open:false, mode: null, id: null });


  // Универсальный обработчик действий (Actions)
  const handleAction = (key, record) => {
    if (key === "edit") {
      setContactModalState({ ...contactModalState, open: true, mode: 'edit', id: record.id });
      return;
    }

    const isDelete = key === "delete";
    const content = isDelete 
      ? t('confirmation.delete') 
      : (record.is_active ? t('confirmation.inactive') : t('confirmation.active'));

    Modal.confirm({
      title: t('buttons.confirm'),
      content: content,
      okText: t('buttons.confirm'),
      okType: isDelete || record.is_active ? 'danger' : 'primary',
      onOk: async () => {
        try {
          const result = await settingService.deleteContact(record.id);
          if (result) {
            toast.success(t(isDelete ? 'response_result.service.delete' : record.is_active ? 'response_result.service.deactivate' : 'response_result.service.activate'));
            loadContacts();
            loadAbout();
          }
        } catch (err) {
          toast.error(err?.response?.data?.message || 'Server error');
        }
      },
    });
  };

  const closeModal = () => {
    setContactModalState({ open: false, mode: null, id: null });
  };

  return (
    <Flex className="rounded-xl" vertical gap="middle">
      {/* Модальные окна */}
      
      <EditAboutModal 
        modalOpen={aboutModalState} 
        setModalOpen={(val) => setAboutModalState(val)} 
        onSuccess={loadAbout} 
      /> 
      <ContactModal 
        modalOpen={contactModalState}
        onClose={closeModal} 
        onSuccess={loadContacts} 
      /> 

      {/* Шапка с поиском */}
      <Card styles={{ body: { padding: 16 } }} className="shadow-sm border-0">
        <Flex gap="large" align="center">
          <Typography.Title level={4} style={{ margin: 0 }} strong>
            {t('about_us')}
          </Typography.Title>
          <Spacer />
          
          <Button 
            size="large" 
            type="primary" 
            onClick={() => setAboutModalState(true)}>
            <Pen size={20} />
            {t('buttons.edit')}
          </Button>
          
        </Flex>
        <Divider />
        <Flex gap="large" align="center" horizontal>
          <Image src={`${http.defaults.baseURL}/uploads/${about.small_image}`} width={120} 
            fallback={placeholder} 
            preview={false}
            style={{ borderRadius: 8 }} />
          <Flex vertical gap="small" style={{ width: '60%' }}>
            <label>{t('fields.short_text')}</label>
            <Input.TextArea value={about.short_text} title={t('fields.short_desc')} readOnly autoSize={{ minRows: 3, maxRows: 3 }} />
          </Flex>
          <Flex vertical gap="small" style={{ width: '60%' }}>
            <label>{t('fields.footer_text')}</label>
            <Input.TextArea value={about.footer_text} title={t('fields.footer_text')} readOnly autoSize={{ minRows: 3, maxRows: 3 }} />
          </Flex>
        </Flex>
      </Card>

      {/* Контент с таблицей */}
      <Card styles={{ body: { padding: 16 } }} className="shadow-sm border-0">
        <Flex gap="large" align="center">
        <Typography.Title level={4} style={{ margin: 0 }} strong>
          {t('contacts')}
        </Typography.Title>
        <Spacer />
          
          <Button 
            size="large" 
            type="primary" 
            onClick={() => setContactModalState({ ...contactModalState, open: true, mode: 'add' })}>
            <Plus size={20} />
            {t('buttons.add')}
          </Button>
          
        </Flex>
        <Divider />
        <ContactTable 
          data={contacts} 
          loading={loading} 
          onAction={handleAction} 
          t={t} 
        />
      </Card>
    </Flex>
  );
}