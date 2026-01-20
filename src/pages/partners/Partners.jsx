import { Button, Flex, Input, Typography, Card, Modal } from "antd";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { usePartners } from "../../hooks/usePartners";
import partnerService from "../../api/partner.service";
import { toast } from "../../utils/toast";

import Spacer from "../../components/ui/Spacer";
import PartnerTable from "./helper/PartnerTable";
import AddPartnerModal from "./AddPartnerModal";
import EditPartnerModal from "../partners/EditPartnerModal";

export default function Partners() {
  const { t } = useTranslation();
  const { partners, loading, setSearch, filteredData, loadPartners } = usePartners();

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
            ? await partnerService.deletePartner(record.id)
            : await partnerService.setStatus(record.id, !record.is_active);

          if (result) {
            toast.success(t(isDelete ? 'response_result.partner.delete' : record.is_active ? 'response_result.partner.deactivate' : 'response_result.partner.activate'));
            loadPartners();
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
       <AddPartnerModal 
        modalOpen={modalState.add}
        setModalOpen={(val) => setModalState(prev => ({ ...prev, add: val }))}
        onSuccess={loadPartners}
      />
       <EditPartnerModal
        id={modalState.id}
        modalOpen={modalState.edit}
        setModalOpen={(val) => setModalState(prev => ({ ...prev, edit: val }))}
        onSuccess={loadPartners}
      />

      {/* Шапка с поиском */}
      <Card styles={{ body: { padding: 16 } }} className="shadow-sm border-0">
        <Flex gap="large" align="center">
          <Typography.Title level={4} style={{ margin: 0 }} strong>
            {t('menu.partners')}
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
        <PartnerTable
          data={filteredData}
          totalServices={partners}
          loading={loading}
          onAction={handleAction}
          t={t}
        />
      </Card>
    </Flex>
  );
}