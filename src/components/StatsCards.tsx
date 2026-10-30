/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Objective } from '../types/objective';
import { Target, Clock, Hourglass, CheckCircle2, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  objectives: Objective[];
  onFilterChange: (status: 'all' | 'not_started' | 'in_progress' | 'completed') => void;
  currentFilter: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  objectives,
  onFilterChange,
  currentFilter,
}) => {
  const total = objectives.length;
  const notStarted = objectives.filter(o => o.status === 'not_started').length;
  const inProgress = objectives.filter(o => o.status === 'in_progress').length;
  const completed = objectives.filter(o => o.status === 'completed').length;

  const percentCompleted = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Banner de Boas-vindas e Progresso Geral */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-2xl p-5 border border-indigo-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <h2 className="text-lg font-bold text-stone-900">
              {total === 0 
                ? 'Pronto para dar o primeiro passo?' 
                : percentCompleted === 100 
                  ? 'Incrível! Todas as suas metas foram concluídas!' 
                  : `Você já concluiu ${percentCompleted}% dos seus objetivos!`
              }
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-xl">
            {total === 0
              ? 'Defina metas curtas e específicas. Uma meta pequena cumprida vale mais que um plano gigante no papel.'
              : 'O segredo para aprender não é a pressa, é manter o ritmo um dia de cada vez.'}
          </p>
        </div>

        {total > 0 && (
          <div className="flex flex-col gap-2 min-w-[220px] bg-white p-3 rounded-xl border border-indigo-100/80 shadow-2xs">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-stone-600 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                Progresso geral
              </span>
              <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-mono">
                {percentCompleted}%
              </span>
            </div>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentCompleted}%` }}
              />
            </div>
            <div className="text-[11px] text-stone-500 text-right">
              {completed} de {total} objetivos concluídos
            </div>
          </div>
        )}
      </div>

      {/* Cards de Métricas e Contadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card: Total */}
        <button
          onClick={() => onFilterChange('all')}
          className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
            currentFilter === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
              : 'bg-white text-stone-800 border-stone-200 hover:border-indigo-300 hover:bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium uppercase tracking-wider ${currentFilter === 'all' ? 'text-indigo-100' : 'text-stone-500'}`}>
              Total
            </span>
            <Target className={`w-4 h-4 ${currentFilter === 'all' ? 'text-indigo-200' : 'text-indigo-600'}`} />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight">{total}</div>
          <div className={`text-xs mt-1 truncate ${currentFilter === 'all' ? 'text-indigo-100' : 'text-stone-500'}`}>
            {total === 1 ? 'Objetivo cadastrado' : 'Objetivos cadastrados'}
          </div>
        </button>

        {/* Card: Não iniciados */}
        <button
          onClick={() => onFilterChange('not_started')}
          className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
            currentFilter === 'not_started'
              ? 'bg-slate-700 text-white border-slate-700 shadow-md shadow-slate-100'
              : 'bg-white text-stone-800 border-stone-200 hover:border-slate-300 hover:bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium uppercase tracking-wider ${currentFilter === 'not_started' ? 'text-slate-200' : 'text-stone-500'}`}>
              Não iniciados
            </span>
            <Clock className={`w-4 h-4 ${currentFilter === 'not_started' ? 'text-slate-300' : 'text-slate-500'}`} />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight">{notStarted}</div>
          <div className={`text-xs mt-1 truncate ${currentFilter === 'not_started' ? 'text-slate-200' : 'text-stone-500'}`}>
            Na fila de estudos
          </div>
        </button>

        {/* Card: Em andamento */}
        <button
          onClick={() => onFilterChange('in_progress')}
          className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
            currentFilter === 'in_progress'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-100'
              : 'bg-white text-stone-800 border-stone-200 hover:border-amber-300 hover:bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium uppercase tracking-wider ${currentFilter === 'in_progress' ? 'text-amber-100' : 'text-stone-500'}`}>
              Em andamento
            </span>
            <Hourglass className={`w-4 h-4 ${currentFilter === 'in_progress' ? 'text-amber-200' : 'text-amber-600'}`} />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight">{inProgress}</div>
          <div className={`text-xs mt-1 truncate ${currentFilter === 'in_progress' ? 'text-amber-100' : 'text-stone-500'}`}>
            Foco ativo no momento
          </div>
        </button>

        {/* Card: Concluídos */}
        <button
          onClick={() => onFilterChange('completed')}
          className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
            currentFilter === 'completed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100'
              : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-300 hover:bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium uppercase tracking-wider ${currentFilter === 'completed' ? 'text-emerald-100' : 'text-stone-500'}`}>
              Concluídos
            </span>
            <CheckCircle2 className={`w-4 h-4 ${currentFilter === 'completed' ? 'text-emerald-200' : 'text-emerald-600'}`} />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight">{completed}</div>
          <div className={`text-xs mt-1 truncate ${currentFilter === 'completed' ? 'text-emerald-100' : 'text-stone-500'}`}>
            Metas superadas!
          </div>
        </button>
      </div>
    </div>
  );
};
