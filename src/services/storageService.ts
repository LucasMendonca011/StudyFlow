/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Objective, ObjectiveFormData } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';
const INITIALIZED_KEY = 'studyflow_initialized_v1';

// Objetivos iniciais de exemplo para acolher o estudante de primeira viagem
const DEFAULT_INITIAL_OBJECTIVES: Objective[] = [
  {
    id: 'demo-obj-1',
    title: 'Compreender os fundamentos de Lógica de Programação',
    description: 'Assistir às aulas de condicionais, loops e funções. Fazer anotações no caderno e praticar 5 exercícios práticos.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'in_progress',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-obj-2',
    title: 'Criar meu primeiro resumo visual de estudos',
    description: 'Elaborar um mapa mental com os principais conceitos estudados na semana para facilitar revisões futuras.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'not_started',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-obj-3',
    title: 'Definir meu horário fixo diário de estudo',
    description: 'Reservar 45 minutos sem distrações no celular todas as noites para consolidar uma rotina consistente.',
    deadline: new Date().toISOString().split('T')[0],
    status: 'completed',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos armazenados no localStorage.
   * Se for o primeiro acesso, carrega exemplos motivadores iniciais.
   */
  getObjectives(): Objective[] {
    try {
      const isInitialized = localStorage.getItem(INITIALIZED_KEY);
      const data = localStorage.getItem(STORAGE_KEY);

      if (!isInitialized && !data) {
        // Primeiro acesso: inicializa com dados amigáveis de exemplo
        this.saveObjectives(DEFAULT_INITIAL_OBJECTIVES);
        localStorage.setItem(INITIALIZED_KEY, 'true');
        return DEFAULT_INITIAL_OBJECTIVES;
      }

      if (!data) {
        return [];
      }

      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveObjectives(objectives: Objective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
      localStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e adiciona um novo objetivo.
   */
  addObjective(formData: ObjectiveFormData): Objective {
    const objectives = this.getObjectives();
    const now = new Date().toISOString();
    
    const newObjective: Objective = {
      id: `obj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newObjective, ...objectives];
    this.saveObjectives(updatedList);
    return newObjective;
  },

  /**
   * Atualiza um objetivo existente pelo ID.
   */
  updateObjective(id: string, updates: Partial<ObjectiveFormData>): Objective | null {
    const objectives = this.getObjectives();
    const index = objectives.findIndex(obj => obj.id === id);

    if (index === -1) {
      return null;
    }

    const updatedObjective: Objective = {
      ...objectives[index],
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : objectives[index].title,
      description: updates.description !== undefined ? updates.description.trim() : objectives[index].description,
      updatedAt: new Date().toISOString(),
    };

    objectives[index] = updatedObjective;
    this.saveObjectives(objectives);
    return updatedObjective;
  },

  /**
   * Remove um objetivo pelo ID.
   */
  deleteObjective(id: string): boolean {
    const objectives = this.getObjectives();
    const filtered = objectives.filter(obj => obj.id !== id);

    if (filtered.length === objectives.length) {
      return false;
    }

    this.saveObjectives(filtered);
    return true;
  },

  /**
   * Limpa todos os dados salvos (opção de reset).
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(INITIALIZED_KEY, 'true');
  }
};
