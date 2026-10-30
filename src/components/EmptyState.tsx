/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Plus, Search, Sparkles, Compass } from 'lucide-react';

interface EmptyStateProps {
  isFilteringOrSearching: boolean;
  onClearFilters?: () => void;
  onOpenNewModal: () => void;
  onAddSampleObjective?: (title: string, description: string, daysAhead: number) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFilteringOrSearching,
  onClearFilters,
  onOpenNewModal,
  onAddSampleObjective,
}) => {
  if (isFilteringOrSearching) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xs space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900">
            Nenhum objetivo encontrado
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            Não encontramos nenhum objetivo de estudo com o filtro ou termo pesquisado.
          </p>
        </div>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
          >
            Limpar filtros e busca
          </button>
        )}
      </div>
    );
  }

  // Lista geral totalmente vazia: acolhimento e suporte para o estudante iniciante
  return (
    <div className="bg-gradient-to-b from-white to-stone-50/50 rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xs space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center shadow-xs">
        <Compass className="w-8 h-8 stroke-[1.75]" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-stone-900">
          Você ainda não tem nenhum objetivo cadastrado
        </h3>
        <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Toda grande conquista de aprendizado começa com uma pequena meta.
          Defina o que você gostaria de praticar ou aprender nos próximos dias.
        </p>
      </div>

      <div>
        <button
          onClick={onOpenNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar meu primeiro objetivo</span>
        </button>
      </div>

      {/* Sugestões rápidas para inspirar o estudante */}
      {onAddSampleObjective && (
        <div className="pt-6 border-t border-stone-200/80 text-left">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Ideias rápidas para começar agora com 1 clique:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() =>
                onAddSampleObjective(
                  'Aprender lógica básica e variáveis',
                  'Fazer anotações dos tipos de dados (texto, número, booleanos) e resolver 3 exercícios.',
                  5
                )
              }
              className="p-3 text-left rounded-xl border border-stone-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 transition cursor-pointer group"
            >
              <div className="text-xs font-bold text-stone-800 group-hover:text-indigo-700">
                💡 Lógica e Variáveis
              </div>
              <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                Praticar tipos de dados e exercícios básicos
              </div>
            </button>

            <button
              onClick={() =>
                onAddSampleObjective(
                  'Organizar 30 minutos diários de leitura técnica',
                  'Ler 5 páginas por dia do livro ou documentação oficial escolhida.',
                  7
                )
              }
              className="p-3 text-left rounded-xl border border-stone-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 transition cursor-pointer group"
            >
              <div className="text-xs font-bold text-stone-800 group-hover:text-indigo-700">
                📚 Hábito de Leitura
              </div>
              <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                Ler capítulos com calma e fazer anotações
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
