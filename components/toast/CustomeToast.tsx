import { toast } from 'react-hot-toast';

interface ToastProps {
  title: string;
  message: string;
}

export const showSuccessToast = ({ title, message }: ToastProps) => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 bg-white border border-l-4 rounded-xl px-5 py-3.5 shadow-lg transition-all duration-300 ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        style={{ borderColor: '#1D9E75', borderLeftColor: '#1D9E75', minWidth: '320px', maxWidth: '380px' }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EAF3DE' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 m-0">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5 m-0">{message}</p>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="text-gray-400 hover:text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    ),
    { duration: 2000, position: 'top-center' },
  );
};

export const showErrorToast = ({ title, message }: ToastProps) => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 bg-white border border-l-4 rounded-xl px-5 py-3.5 shadow-lg transition-all duration-300 ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        style={{ borderColor: '#E24B4A', borderLeftColor: '#E24B4A', minWidth: '320px', maxWidth: '380px' }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FCEBEB' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 m-0">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5 m-0">{message}</p>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="text-gray-400 hover:text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    ),
    { duration: 2000, position: 'top-center' },
  );
};

export const showInfoToast = ({ title, message }: ToastProps) => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 bg-white border border-l-4 rounded-xl px-5 py-3.5 shadow-lg transition-all duration-300 ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        style={{ borderColor: '#378ADD', borderLeftColor: '#378ADD', minWidth: '320px', maxWidth: '380px' }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#E6F1FB' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 m-0">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5 m-0">{message}</p>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="text-gray-400 hover:text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    ),
    { duration: 2000, position: 'top-center' },
  );
};
