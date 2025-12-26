/**
 * Modern Filters component for todo list
 */
'use client';

import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

export default function TodoFilters({ filters, onFilterChange }) {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCompletedFilter = (value) => {
    onFilterChange({ ...filters, completed: value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sort: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({
      completed: 'all',
      search: '',
      sort: 'created_at',
      order: 'desc'
    });
  };

  return (
    <div className="glass-card p-5 space-y-4 rounded-2xl">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          id="search"
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={handleSearchChange}
          className="flex-1"
        />

        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <button
            onClick={() => handleCompletedFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
              filters.completed === 'all'
                ? 'bg-brand-500 text-white shadow-neon'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleCompletedFilter('false')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
              filters.completed === 'false'
                ? 'bg-brand-500 text-white shadow-neon'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => handleCompletedFilter('true')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
              filters.completed === 'true'
                ? 'bg-brand-500 text-white shadow-neon'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Done
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Select
          id="sort"
          value={filters.sort}
          onChange={handleSortChange}
          options={[
            { value: 'created_at', label: 'Created Date' },
            { value: 'updated_at', label: 'Updated Date' },
            { value: 'title', label: 'Title' }
          ]}
          className="max-w-xs"
        />

        <Button
          variant="ghost"
          onClick={clearFilters}
          className="text-brand-300 hover:text-brand-200"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
