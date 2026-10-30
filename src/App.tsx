/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Objective, ObjectiveFormData, ObjectiveStatus, FilterStatus, SortOption } from './types/objective';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { EmptyState } from './components/EmptyState';
import { Check, Info } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados de filtros, busca e ordenação
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState<SortOption>('deadline-asc');

  // Estados de modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState<Objective | null>(null);

  // Notificação toast para feedback acolhedor
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Carrega objetivos do localStorage na montagem inicial
  useEffect(() => {
    const loaded = storageService.getObjectives();
    setObjectives(loaded);
    setIsLoaded(true);
  }, []);

  // Handlers para criação e edição
  const handleOpenCreateModal = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (obj: Objective) => {
    setEditingObjective(obj);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      // Edição
      const updated = storageService.updateObjective(editingObjective.id, formData);
      if (updated) {
        setObjectives(prev => prev.map(item => (item.id === updated.id ? updated : item)));
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      // Criação
      const created = storageService.addObjective(formData);
      setObjectives(prev => [created, ...prev]);
      showToast('Novo objetivo de estudo cadastrado!');
    }
  };

  // Mudança rápida de status
  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = storageService.updateObjective(id, { status: newStatus });
    if (updated) {
      setObjectives(prev => prev.map(item => (item.id === id ? updated : item)));
      if (newStatus === 'completed') {
        showToast('Parabéns! Mais um objetivo concluído! 🎉');
      } else if (newStatus === 'in_progress') {
        showToast('Objetivo marcado em andamento. Bom foco!');
      } else {
        showToast('Status atualizado.');
      }
    }
  };

  // Handlers de exclusão com confirmação
  const handleDeleteRequest = (obj: Objective) => {
    setObjectiveToDelete(obj);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (objectiveToDelete) {
      const success = storageService.deleteObjective(objectiveToDelete.id);
      if (success) {
        setObjectives(prev => prev.filter(item => item.id !== objectiveToDelete.id));
        showToast('Objetivo excluído.');
      }
    }
    setIsDeleteModalOpen(false);
    setObjectiveToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setObjectiveToDelete(null);
  };

  // Criação rápida de sugestões quando vazio
  const handleAddSampleObjective = (title: string, description: string, daysAhead: number) => {
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + daysAhead);
    const deadline = deadlineDate.toISOString().split('T')[0];

    const created = storageService.addObjective({
      title,
      description,
      deadline,
      status: 'in_progress',
    });
    setObjectives(prev => [created, ...prev]);
    showToast('Objetivo de exemplo adicionado à sua lista!');
  };

  // Contagens para filtros
  const counts = useMemo(() => {
    return {
      all: objectives.length,
      not_started: objectives.filter(o => o.status === 'not_started').length,
      in_progress: objectives.filter(o => o.status === 'in_progress').length,
      completed: objectives.filter(o => o.status === 'completed').length,
    };
  }, [objectives]);

  // Lista filtrada e ordenada
  const filteredAndSortedObjectives = useMemo(() => {
    let result = [...objectives];

    // 1. Filtro por status
    if (currentFilter !== 'all') {
      result = result.filter(obj => obj.status === currentFilter);
    }

    // 2. Filtro por busca
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        obj =>
          obj.title.toLowerCase().includes(q) ||
          (obj.description && obj.description.toLowerCase().includes(q))
      );
    }

    // 3. Ordenação
    result.sort((a, b) => {
      if (currentSort === 'deadline-asc') {
        // Prazos mais próximos primeiro; sem prazo vai para o fim
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      }
      if (currentSort === 'deadline-desc') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return b.deadline.localeCompare(a.deadline);
      }
      if (currentSort === 'title-asc') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      if (currentSort === 'created-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }, [objectives, currentFilter, searchQuery, currentSort]);

  const isFilteringOrSearching = currentFilter !== 'all' || searchQuery.trim().length > 0;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-500">
        <p className="text-sm animate-pulse">Carregando StudyFlow...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800">
      {/* Cabeçalho */}
      <Header
        onOpenNewModal={handleOpenCreateModal}
        totalObjectives={objectives.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Métricas e Progresso */}
        <StatsCards
          objectives={objectives}
          onFilterChange={setCurrentFilter}
          currentFilter={currentFilter}
        />

        {/* Barra de Filtros e Busca */}
        {objectives.length > 0 && (
          <FilterBar
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            counts={counts}
          />
        )}

        {/* Listagem de Cartões ou Estado Vazio */}
        {filteredAndSortedObjectives.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500 px-1">
              <span>
                Exibindo {filteredAndSortedObjectives.length}{' '}
                {filteredAndSortedObjectives.length === 1 ? 'objetivo' : 'objetivos'}
                {isFilteringOrSearching && ` de ${objectives.length} no total`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedObjectives.map(obj => (
                <ObjectiveCard
                  key={obj.id}
                  objective={obj}
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={handleDeleteRequest}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            isFilteringOrSearching={isFilteringOrSearching}
            onClearFilters={() => {
              setCurrentFilter('all');
              setSearchQuery('');
            }}
            onOpenNewModal={handleOpenCreateModal}
            onAddSampleObjective={handleAddSampleObjective}
          />
        )}
      </main>

      {/* Rodapé Simples e Acolhedor */}
      <footer className="border-t border-stone-200 bg-white/60 py-6 text-center text-xs text-stone-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>StudyFlow • Organize seus estudos passo a passo</span>
          <span className="text-stone-400">
            Seus dados ficam salvos localmente no seu navegador.
          </span>
        </div>
      </footer>

      {/* Modais */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingObjective(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingObjective}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        objective={objectiveToDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
