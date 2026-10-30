/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Objective } from '../types/objective';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  objective: Objective | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  objective,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !objective) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden flex flex-col"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Cancelar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 id="delete-dialog-title" className="text-base sm:text-lg font-bold text-stone-900">
              Excluir este objetivo?
            </h3>
            <p id="delete-dialog-description" className="text-xs sm:text-sm text-stone-600 mt-1">
              Tem certeza que deseja remover o objetivo de estudo:
            </p>
            <div className="mt-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-sm font-semibold italic break-words">
              "{objective.title}"
            </div>
            <p className="text-xs text-rose-600 mt-2">
              Esta ação é permanente e os dados serão excluídos do seu navegador.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Sim, excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
