/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FilterStatus, SortOption } from '../types/objective';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    all: number;
    not_started: number;
    in_progress: number;
    completed: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  currentSort,
  onSortChange,
  counts,
}) => {
  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Barra de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição de estudo..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-stone-800 placeholder-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2 self-end md:self-auto text-xs sm:text-sm">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
          <span className="text-stone-500 hidden sm:inline">Ordenar:</span>
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="py-1.5 px-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer font-medium"
          >
            <option value="created-desc">Mais recentes primeiro</option>
            <option value="deadline-asc">Prazo mais próximo</option>
            <option value="deadline-desc">Prazo mais distante</option>
            <option value="title-asc">Título (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Abas Rápidas de Filtro por Status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 sm:pb-0 scrollbar-none">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentFilter === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <span>Todos</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${currentFilter === 'all' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-700'}`}>
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('not_started')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentFilter === 'not_started'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>Não iniciados</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${currentFilter === 'not_started' ? 'bg-slate-600 text-white' : 'bg-stone-200 text-stone-700'}`}>
            {counts.not_started}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('in_progress')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentFilter === 'in_progress'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Em andamento</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${currentFilter === 'in_progress' ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-700'}`}>
            {counts.in_progress}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('completed')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentFilter === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Concluídos</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${currentFilter === 'completed' ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'}`}>
            {counts.completed}
          </span>
        </button>
      </div>
    </div>
  );
};
