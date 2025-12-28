'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslations } from '../providers/IntlProvider';
import TaskTableRow from './TaskTableRow';

/**
 * Task Table Component
 * Displays tasks in a filterable, searchable, paginated table
 */
export default function TaskTable({ tasks = [], onToggleComplete, onDelete, onEdit }) {
  const t = useTranslations('dashboard.taskTable');
  const tCommon = useTranslations('common');

  // Filter and pagination state
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  // Debounce search input (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and search tasks (using debounced query)
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Filter by search query (debounced)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [tasks, statusFilter, debouncedSearchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="glass-panel rounded-xl p-6 border border-white/20">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t('title')}</h3>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('searchPlaceholder')}
                className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                aria-label={t('searchPlaceholder')}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/50 absolute left-3 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent cursor-pointer"
              aria-label={t('filterLabel')}
            >
              <option value="all">{t('filterAll')}</option>
              <option value="pending">{t('filterPending')}</option>
              <option value="completed">{t('filterCompleted')}</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-white/60" role="status" aria-live="polite">
          {t('showing')} {paginatedTasks.length} {t('of')} {filteredTasks.length} {t('tasks')}
          {filteredTasks.length !== tasks.length && ` (${t('filteredFrom')} ${tasks.length} ${t('total')})`}
        </div>
      </div>

      {/* Table or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h4 className="text-lg font-semibold text-white mb-2">{t('noTasksFound')}</h4>
          <p className="text-white/60">
            {searchQuery || statusFilter !== 'all'
              ? t('emptyFiltered')
              : t('emptyState')}
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px]" role="table">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider w-16">
                    {tCommon('done')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                    {t('taskColumn')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider w-32">
                    {t('statusColumn')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider w-32">
                    {t('createdColumn')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider w-24">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTasks.map((task) => (
                  <TaskTableRow
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <div className="text-sm text-white/60">
                {t('page')} {currentPage} {t('of')} {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {t('previous')}
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 rounded-lg border border-brand-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {t('next')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
