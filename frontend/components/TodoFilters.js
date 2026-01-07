/**
 * Elite Todo Filters with Cinematic UI
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
    <div className="glass-panel p-8 space-y-8 rounded-[2.5rem] border-white/5 shadow-premium group">
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="w-full lg:flex-1">
          <Input
            id="search"
            type="text"
            placeholder="Scan objectives..."
            value={filters.search}
            onChange={handleSearchChange}
            className="bg-black/30 border-white/5 hover:border-brand-500/20"
          />
        </div>

        <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-xl">
          {[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'false' },
            { label: 'Done', value: 'true' }
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleCompletedFilter(mode.value)}
              className={`px-6 py-2.5 rounded-xl transition-all duration-500 font-bold uppercase tracking-[0.2em] text-[10px] ${filters.completed === mode.value
                  ? 'bg-brand-500 text-black shadow-neon'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-2">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 shrink-0">Sort Matrix</div>
          <Select
            id="sort"
            value={filters.sort}
            onChange={handleSortChange}
            options={[
              { value: 'created_at', label: 'Initialization' },
              { value: 'updated_at', label: 'Last Sync' },
              { value: 'title', label: 'Identity' }
            ]}
            className="min-w-[180px] bg-black/20"
          />
        </div>

        <Button
          variant="ghost"
          onClick={clearFilters}
          className="text-brand-400 hover:text-white uppercase tracking-[0.2em] text-[10px] font-black hover:bg-brand-500/10 px-6 py-3 rounded-xl border border-transparent hover:border-brand-500/20"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
