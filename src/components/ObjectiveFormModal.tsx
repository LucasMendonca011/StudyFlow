/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Objective, ObjectiveFormData, ObjectiveStatus } from '../types/objective';
import { X, Calendar, BookOpen, Clock, AlertCircle, HelpCircle } from 'lucide-react';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ObjectiveFormData) => void;
  initialData?: Objective | null;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('not_started');
  const [errorMessage, setErrorMessage] = useState('');

  // Sincroniza formulário com dados quando abrir para edição ou novo
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description || '');
        setDeadline(initialData.deadline || '');
        setStatus(initialData.status);
      } else {
        // Reset para novo cadastro
        setTitle('');
        setDescription('');
        // Sugere prazo padrão de 7 dias para frente
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        setDeadline(nextWeek);
        setStatus('not_started');
      }
      setErrorMessage('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Por favor, informe o título do seu objetivo de estudo.');
      return;
    }

    setErrorMessage('');
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
    onClose();
  };

  // Atalhos rápidos para preenchimento de data
  const setQuickDate = (daysToAdd: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    setDeadline(targetDate.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base sm:text-lg font-bold text-stone-900">
                {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-stone-500">
                {isEditing ? 'Atualize as informações da sua meta' : 'Defina o que você quer aprender com clareza'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com scroll se necessário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 overflow-y-auto flex-1">
          {/* Mensagem de Erro de Validação */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Campo: Título */}
          <div>
            <label htmlFor="objective-title" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="objective-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Ex: Aprender laços for e while em JavaScript"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition text-stone-900 placeholder-stone-400"
              autoFocus
            />
            <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Dica: Escolha um tema específico para não se sobrecarregar.
            </p>
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="objective-description" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Descrição e anotações <span className="text-stone-400 font-normal lowercase">(opcional)</span>
            </label>
            <textarea
              id="objective-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quais aulas assistir? Quais capítulos ler? Links ou materiais importantes..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition text-stone-900 placeholder-stone-400 resize-none"
            />
          </div>

          {/* Campo: Prazo de Conclusão */}
          <div>
            <label htmlFor="objective-deadline" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Prazo limite
            </label>
            <div className="relative">
              <input
                id="objective-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition text-stone-900 cursor-pointer"
              />
            </div>

            {/* Atalhos rápidos de data */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-stone-400">Atalhos:</span>
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(3)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              >
                Em 3 dias
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(7)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              >
                Em 1 semana
              </button>
              {deadline && (
                <button
                  type="button"
                  onClick={() => setDeadline('')}
                  className="text-[11px] px-2 py-0.5 rounded-md text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                >
                  Sem data
                </button>
              )}
            </div>
          </div>

          {/* Campo: Status */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Status do objetivo
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition text-center ${
                  status === 'not_started'
                    ? 'border-slate-600 bg-slate-50 text-slate-900 ring-2 ring-slate-400/20 font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="not_started"
                  checked={status === 'not_started'}
                  onChange={() => setStatus('not_started')}
                  className="sr-only"
                />
                <span className="text-base mb-1">⚪</span>
                <span>Não iniciado</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition text-center ${
                  status === 'in_progress'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-400/20 font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="in_progress"
                  checked={status === 'in_progress'}
                  onChange={() => setStatus('in_progress')}
                  className="sr-only"
                />
                <span className="text-base mb-1">🟡</span>
                <span>Em andamento</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition text-center ${
                  status === 'completed'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/20 font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={status === 'completed'}
                  onChange={() => setStatus('completed')}
                  className="sr-only"
                />
                <span className="text-base mb-1">🟢</span>
                <span>Concluído</span>
              </label>
            </div>
          </div>

          {/* Rodapé do Modal */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
