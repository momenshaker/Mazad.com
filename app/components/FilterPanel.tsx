'use client';

import { useMemo, useState } from 'react';
import type { CategoryFilter, FilterOption } from '../types';

type FilterPanelProps = {
  title?: string;
  filters: CategoryFilter[];
};

type FilterState = Record<string, string>;

const normalizeOption = (option: FilterOption) =>
  typeof option === 'string' ? { value: option, label: option } : option;

const FilterPanel = ({ title = 'Filters', filters }: FilterPanelProps) => {
  const [state, setState] = useState<FilterState>({ condition: 'used' });

  const visibleFilters = useMemo(
    () =>
      filters.filter((filter) => {
        if (!filter.visibleWhen) {
          return true;
        }
        return Object.entries(filter.visibleWhen).every(([key, value]) => state[key] === String(value));
      }),
    [filters, state]
  );

  const handleChange = (key: string, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleRangeChange = (key: string, part: 'min' | 'max', value: string) => {
    setState((prev) => ({ ...prev, [`${key}_${part}`]: value }));
  };

  return (
    <aside className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <header>
        <h2 className="text-lg font-semibold text-brand-primary">{title}</h2>
        <p className="text-xs text-slate-500">Selections update the query parameters in the live app.</p>
      </header>
      <dl className="space-y-4">
        {visibleFilters.map((filter) => {
          switch (filter.type) {
            case 'select': {
              const options = (filter.options ?? []).map(normalizeOption);
              return (
                <div key={filter.key}>
                  <dt className="text-sm font-medium text-slate-700 capitalize">{filter.key.replace(/_/g, ' ')}</dt>
                  <dd>
                    <select
                      className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                      value={state[filter.key] ?? ''}
                      onChange={(event) => handleChange(filter.key, event.target.value)}
                    >
                      <option value="">Any</option>
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>
              );
            }
            case 'segmented': {
              const options = (filter.options ?? []).map(normalizeOption);
              return (
                <div key={filter.key}>
                  <dt className="text-sm font-medium text-slate-700 capitalize">{filter.key.replace(/_/g, ' ')}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {options.map((option) => {
                      const isActive = state[filter.key] === option.value;
                      return (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() => handleChange(filter.key, option.value)}
                          className={`rounded-full border px-3 py-1 text-sm transition ${
                            isActive
                              ? 'border-brand-accent bg-brand-accent text-white'
                              : 'border-slate-200 bg-slate-100 text-slate-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </dd>
                </div>
              );
            }
            case 'range': {
              return (
                <div key={filter.key}>
                  <dt className="text-sm font-medium text-slate-700 capitalize">{filter.key.replace(/_/g, ' ')}</dt>
                  <dd className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <label className="block text-xs text-slate-500" htmlFor={`${filter.key}-min`}>
                        Min
                      </label>
                      <input
                        id={`${filter.key}-min`}
                        type="number"
                        className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                        min={filter.min}
                        max={filter.max}
                        value={state[`${filter.key}_min`] ?? ''}
                        onChange={(event) => handleRangeChange(filter.key, 'min', event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500" htmlFor={`${filter.key}-max`}>
                        Max
                      </label>
                      <input
                        id={`${filter.key}-max`}
                        type="number"
                        className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                        min={filter.min}
                        max={filter.max}
                        value={state[`${filter.key}_max`] ?? ''}
                        onChange={(event) => handleRangeChange(filter.key, 'max', event.target.value)}
                      />
                    </div>
                  </dd>
                </div>
              );
            }
            case 'number': {
              return (
                <div key={filter.key}>
                  <dt className="text-sm font-medium text-slate-700 capitalize">{filter.key.replace(/_/g, ' ')}</dt>
                  <dd>
                    <input
                      type="number"
                      className="mt-2 w-full rounded border border-slate-300 px-3 py-2"
                      min={filter.min}
                      max={filter.max}
                      value={state[filter.key] ?? ''}
                      onChange={(event) => handleChange(filter.key, event.target.value)}
                    />
                  </dd>
                </div>
              );
            }
            case 'date': {
              return (
                <div key={filter.key}>
                  <dt className="text-sm font-medium text-slate-700 capitalize">{filter.key.replace(/_/g, ' ')}</dt>
                  <dd>
                    <input
                      type="date"
                      className="mt-2 w-full rounded border border-slate-300 px-3 py-2"
                      value={state[filter.key] ?? ''}
                      onChange={(event) => handleChange(filter.key, event.target.value)}
                    />
                  </dd>
                </div>
              );
            }
            case 'text':
            default: {
              return (
                <div key={filter.key}>
                  <dt className="text-sm font-medium text-slate-700 capitalize">{filter.key.replace(/_/g, ' ')}</dt>
                  <dd>
                    <input
                      type="text"
                      className="mt-2 w-full rounded border border-slate-300 px-3 py-2"
                      value={state[filter.key] ?? ''}
                      onChange={(event) => handleChange(filter.key, event.target.value)}
                    />
                  </dd>
                </div>
              );
            }
          }
        })}
      </dl>
      <footer className="border-t border-slate-200 pt-4 text-xs text-slate-500">
        Selected filters (mock state):
        <pre className="mt-2 rounded bg-slate-100 p-2 text-[10px] leading-tight text-slate-700">
          {JSON.stringify(state, null, 2)}
        </pre>
      </footer>
    </aside>
  );
};

export default FilterPanel;
