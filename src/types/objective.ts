/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ObjectiveStatus = 'not_started' | 'in_progress' | 'completed';

export interface Objective {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: ObjectiveStatus;
  createdAt: string;
  updatedAt: string;
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
};

export type FilterStatus = 'all' | ObjectiveStatus;

export type SortOption = 'deadline-asc' | 'deadline-desc' | 'title-asc' | 'created-desc';
