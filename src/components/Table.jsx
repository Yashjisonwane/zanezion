import React from 'react';
import StatusBadge from './StatusBadge';
import { Eye, Edit2, Trash2, PackageOpen } from 'lucide-react';

const Table = ({ columns, data, actions, onView, onEdit, onDelete, customAction }) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-border flex items-center justify-center">
          <PackageOpen size={28} className="text-muted opacity-40" />
        </div>
        <div>
          <p className="text-sm font-bold text-secondary">No records found</p>
          <p className="text-[11px] text-muted mt-1">Try adjusting your search or add a new entry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* ── Desktop Table ─────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 text-[10px] font-black text-muted/60 uppercase tracking-[0.15em] whitespace-nowrap w-8">#</th>
              {columns.map((col, idx) => (
                <th key={idx} className="text-left py-4 px-4 text-[10px] font-black text-muted uppercase tracking-[0.15em] whitespace-nowrap">
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="text-right py-4 px-4 text-[10px] font-black text-muted uppercase tracking-[0.15em] whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-white/[0.025] transition-all duration-150 group"
              >
                {/* Row number */}
                <td className="py-4 px-4 text-xs text-muted/40 font-bold tabular-nums">
                  {(rowIdx + 1).toString().padStart(2, '0')}
                </td>

                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="py-4 px-4 text-sm whitespace-nowrap">
                    {col.render ? col.render(row) : (
                      col.accessor === 'status'
                        ? <StatusBadge status={row[col.accessor]} />
                        : <span className="font-semibold text-primary/90">{row[col.accessor]}</span>
                    )}
                  </td>
                ))}

                {actions && (
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 transition-opacity">
                      {customAction && customAction(row)}
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          title="View"
                          className="p-2 rounded-lg text-secondary hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          title="Edit"
                          className="p-2 rounded-lg text-secondary hover:text-accent hover:bg-accent/10 transition-all"
                        >
                          <Edit2 size={15} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          title="Delete"
                          className="p-2 rounded-lg text-secondary hover:text-danger hover:bg-danger/10 transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer row count */}
        <div className="flex items-center justify-between px-4 pt-4 pb-1 border-t border-border/40 mt-1">
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
            {data.length} {data.length === 1 ? 'Record' : 'Records'}
          </p>
        </div>
      </div>

      {/* ── Mobile Card View ──────────────────────── */}
      <div className="md:hidden space-y-3">
        {data.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="bg-white/[0.02] border border-border rounded-2xl p-4 space-y-4 hover:border-accent/30 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">{columns[0].header}</p>
                <p className="text-sm font-bold text-white">{row[columns[0].accessor]}</p>
              </div>
              <StatusBadge status={row.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {columns.slice(1).map((col, colIdx) => (
                col.accessor !== 'status' && (
                  <div key={colIdx}>
                    <p className="text-[9px] text-muted font-black uppercase tracking-widest mb-0.5">{col.header}</p>
                    <div className="text-xs font-semibold text-secondary break-words">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </div>
                  </div>
                )
              ))}
            </div>

            {actions && (
              <div className="pt-3 border-t border-border/40 space-y-3">
                {customAction && (
                  <div className="flex flex-col gap-2">
                    {customAction(row)}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {onView && (
                    <button
                      onClick={() => onView(row)}
                      className="flex-1 py-2.5 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-secondary hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/5"
                    >
                      <Eye size={13} /> View Protocol
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="flex-1 py-2.5 bg-accent/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-accent hover:bg-accent/15 transition-all flex items-center justify-center gap-2 border border-accent/10"
                    >
                      <Edit2 size={13} /> Modify
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="col-span-2 py-2.5 bg-danger/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-danger hover:bg-danger/15 transition-all flex items-center justify-center gap-2 border border-danger/10"
                    >
                      <Trash2 size={13} /> Purge Asset
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
