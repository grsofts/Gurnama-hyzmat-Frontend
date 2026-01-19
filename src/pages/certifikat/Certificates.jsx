import { Button, Flex, Input, Typography, Card, Modal } from "antd";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useCertificates } from "../../hooks/useCertificates";
import certService from "../../api/certificate.service";
import { toast } from "../../utils/toast";

import Spacer from "../../components/ui/Spacer";
import CertTable from "./helper/CertTable";
import AddCertModal from "./AddCertModal";
import EditCertModal from "./EditCertModal";

export default function Certificates() {
  const { t } = useTranslation();
  const { certificates, loading, setSearch, filteredData, loadCertificates } = useCertificates();

  const [modalState, setModalState] = useState({ edit: false, add: false, id: null });

  // Универсальный обработчик действий (Actions)
  const handleAction = (key, record) => {
    if (key === "edit") {
      setModalState({ ...modalState, edit: true, id: record.id });
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
          const result = isDelete 
            ? await certService.deleteCertificate(record.id)
            : await certService.setStatus(record.id, !record.is_active);

          if (result) {
            toast.success(t(isDelete ? 'response_result.certificate.delete' : record.is_active ? 'response_result.certificate.deactivate' : 'response_result.certificate.activate'));
            loadCertificates();
          }
        } catch (err) {
          toast.error(err?.response?.data?.message || 'Server error');
        }
      },
    });
  };

  return (
    <Flex className="rounded-xl" vertical gap="middle">
      {/* Модальные окна */}
       <AddCertModal 
        modalOpen={modalState.add} 
        setModalOpen={(val) => setModalState(prev => ({ ...prev, add: val }))} 
        onSuccess={loadCertificates} 
      /> 
       <EditCertModal 
        id={modalState.id}
        modalOpen={modalState.edit} 
        setModalOpen={(val) => setModalState(prev => ({ ...prev, edit: val }))} 
        onSuccess={loadCertificates} 
      /> 

      {/* Шапка с поиском */}
      <Card styles={{ body: { padding: 16 } }} className="shadow-sm border-0">
        <Flex gap="large" align="center">
          <Typography.Title level={4} style={{ margin: 0 }} strong>
            {t('menu.certificates')}
          </Typography.Title>
          <Spacer />
          <Input
            placeholder="Search.."
            size="large"
            allowClear
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Button 
            size="large" 
            type="primary" 
            onClick={() => setModalState(prev => ({ ...prev, add: true }))}
          >
            <Plus size={20} />
            {t('buttons.add')}
          </Button>
        </Flex>
      </Card>

      {/* Контент с таблицей */}
      <Card styles={{ body: { padding: 16 } }} className="shadow-sm border-0">
        <CertTable 
          data={filteredData} 
          totalServices={certificates}
          loading={loading} 
          onAction={handleAction} 
          t={t} 
        />
      </Card>
    </Flex>
  );
}