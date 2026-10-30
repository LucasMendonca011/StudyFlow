/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Objective, ObjectiveStatus } from '../types/objective';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, Hourglass, AlertCircle } from 'lucide-react';

interface ObjectiveCardProps {
  objective: Objective;
  onEdit: (objective: Objective) => void;
  onDeleteRequest: (objective: Objective) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  // Configuração visual de status
  const statusConfig = {
    not_started: {
      label: 'Não iniciado',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Clock,
      borderClass: 'border-l-slate-400',
    },
    in_progress: {
      label: 'Em andamento',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Hourglass,
      borderClass: 'border-l-amber-500',
    },
    completed: {
      label: 'Concluído',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      borderClass: 'border-l-emerald-500',
    },
  }[objective.status];

  const StatusIcon = statusConfig.icon;

  // Formatação de data e cálculo de urgência
  const formatDeadlineInfo = (deadlineStr: string) => {
    if (!deadlineStr) {
      return { text: 'Sem prazo definido', isOverdue: false, isToday: false, badgeColor: 'text-stone-400' };
    }

    try {
      const parts = deadlineStr.split('-');
      if (parts.length !== 3) return { text: deadlineStr, isOverdue: false, isToday: false, badgeColor: 'text-stone-500' };

      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const deadlineDate = new Date(year, month, day);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      const formatted = deadlineDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      if (objective.status === 'completed') {
        return { text: formatted, isOverdue: false, isToday: false, badgeColor: 'text-stone-500' };
      }

      if (diffDays < 0) {
        return {
          text: `${formatted} (Atrasado ${Math.abs(diffDays)}d)`,
          isOverdue: true,
          isToday: false,
          badgeColor: 'text-rose-600 font-semibold',
        };
      } else if (diffDays === 0) {
        return {
          text: `${formatted} (Vence hoje!)`,
          isOverdue: false,
          isToday: true,
          badgeColor: 'text-amber-600 font-semibold',
        };
      } else if (diffDays === 1) {
        return {
          text: `${formatted} (Vence amanhã)`,
          isOverdue: false,
          isToday: false,
          badgeColor: 'text-indigo-600',
        };
      } else if (diffDays <= 7) {
        return {
          text: `${formatted} (em ${diffDays} dias)`,
          isOverdue: false,
          isToday: false,
          badgeColor: 'text-indigo-600',
        };
      }

      return { text: formatted, isOverdue: false, isToday: false, badgeColor: 'text-stone-600' };
    } catch {
      return { text: deadlineStr, isOverdue: false, isToday: false, badgeColor: 'text-stone-500' };
    }
  };

  const deadlineInfo = formatDeadlineInfo(objective.deadline);

  return (
    <div
      className={`group bg-white rounded-xl border border-stone-200 hover:border-stone-300 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between overflow-hidden border-l-4 ${statusConfig.borderClass} ${
        objective.status === 'completed' ? 'bg-stone-50/40' : ''
      }`}
    >
      <div className="p-4 sm:p-5 space-y-3">
        {/* Cabeçalho do Card: Status e Ações Rápidas */}
        <div className="flex items-start justify-between gap-2">
          {/* Seletor rápido de Status */}
          <div className="relative inline-block">
            <select
              value={objective.status}
              onChange={(e) => onStatusChange(objective.id, e.target.value as ObjectiveStatus)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors ${statusConfig.badgeClass}`}
              title="Clique para alterar o status rapidamente"
            >
              <option value="not_started">⚪ Não iniciado</option>
              <option value="in_progress">🟡 Em andamento</option>
              <option value="completed">🟢 Concluído</option>
            </select>
          </div>

          {/* Botões de Ação (Editar e Excluir) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(objective)}
              className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label={`Editar ${objective.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteRequest(objective)}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir ${objective.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <div>
          <h3
            className={`text-base font-bold text-stone-900 leading-snug break-words ${
              objective.status === 'completed' ? 'line-through text-stone-500' : ''
            }`}
          >
            {objective.title}
          </h3>
        </div>

        {/* Descrição do Objetivo */}
        {objective.description ? (
          <p
            className={`text-xs sm:text-sm text-stone-600 whitespace-pre-line leading-relaxed break-words line-clamp-3 ${
              objective.status === 'completed' ? 'text-stone-400' : ''
            }`}
          >
            {objective.description}
          </p>
        ) : (
          <p className="text-xs text-stone-400 italic">Sem descrição detalhada.</p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Botão de Conclusão Rápida */}
      <div className="px-4 sm:px-5 py-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 gap-2">
        <div className="flex items-center gap-1.5 truncate">
          {deadlineInfo.isOverdue ? (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          ) : (
            <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          )}
          <span className={`truncate ${deadlineInfo.badgeColor}`}>
            {deadlineInfo.text}
          </span>
        </div>

        {/* Atalho para alternar Concluído */}
        {objective.status !== 'completed' ? (
          <button
            onClick={() => onStatusChange(objective.id, 'completed')}
            className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 hover:underline shrink-0 cursor-pointer"
          >
            Marcar concluído
          </button>
        ) : (
          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            Finalizado
          </span>
        )}
      </div>
    </div>
  );
};
