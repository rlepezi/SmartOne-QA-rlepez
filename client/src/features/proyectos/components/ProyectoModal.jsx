import { X } from 'lucide-react';
import ProyectoForm from './ProyectoForm';

/**
 * Modal para creación de proyecto. Cierre y onSuccess los maneja el padre.
 */
export default function ProyectoModal({ open, onClose, onSuccess }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">Nuevo Proyecto</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6">
          <ProyectoForm
            mode="create"
            onSuccess={(result) => {
              onSuccess?.(result);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
