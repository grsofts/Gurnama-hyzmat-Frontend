import { Button, Flex, Input, Typography, Card, Modal } from "antd";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useProjects } from "../../hooks/useProjects";
import projectService from "../../api/project.service";
import { toast } from "../../utils/toast";

import Spacer from "../../components/ui/Spacer";
import ProjectsTable from "./helper/ProjectsTable";
import AddProjectModal from "./AddProjectModal";

export default function Projects() {
  const { t } = useTranslation();
  const { projects, loading, setSearch, filteredData, loadProjects } = useProjects();

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
            ? await projectService.deleteProject(record.id)
            : await projectService.setStatus(record.id, !record.is_active);

          if (result) {
            toast.success(t(isDelete ? 'response_result.project.delete' : record.is_active ? 'response_result.project.deactivate' : 'response_result.project.activate'));
            loadProjects();
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
       <AddProjectModal 
        modalOpen={modalState.add} 
        setModalOpen={(val) => setModalState(prev => ({ ...prev, add: val }))} 
        onSuccess={loadProjects} 
      />
       {/*<EditServiceModal 
        id={modalState.id}
        modalOpen={modalState.edit} 
        setModalOpen={(val) => setModalState(prev => ({ ...prev, edit: val }))} 
        onSuccess={loadProjects} 
      /> */}

      {/* Шапка с поиском */}
      <Card styles={{ body: { padding: 16 } }} className="shadow-sm border-0">
        <Flex gap="large" align="center">
          <Typography.Title level={4} style={{ margin: 0 }} strong>
            {t('menu.projects')}
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
        <ProjectsTable 
          data={filteredData} 
          totalProjects={projects}
          loading={loading} 
          onAction={handleAction} 
          t={t} 
        />
      </Card>
    </Flex>
  );
}