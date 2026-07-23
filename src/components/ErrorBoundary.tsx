import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error) {
    console.error('Uncaught React application error:', error);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleHardReset = () => {
    try {
      localStorage.clear();
    } catch { /* ignore */ }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-slate-900 border border-amber-500/50 p-6 rounded-2xl max-w-lg shadow-2xl space-y-4 backdrop-blur-md">
            <span className="text-5xl animate-bounce inline-block">🔮</span>
            <h2 className="text-xl font-black text-amber-400">Произошла непредвиденная ошибка</h2>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono">
              {this.state.error?.message
                ? `Детали ошибки: ${this.state.error.message}`
                : 'Произошел сбой при отрисовке компонентов интерфейса.'}
            </p>
            <p className="text-[11px] text-slate-400">
              Ваш прогресс сохранен в локальном хранилище. Попробуйте просто перезапустить приложение.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-black rounded-xl text-xs text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>🔄 Перезапустить приложение</span>
              </button>
              <button
                onClick={this.handleHardReset}
                className="py-3 px-4 bg-slate-800 hover:bg-red-950/80 font-bold rounded-xl text-xs text-red-300 hover:text-red-100 border border-slate-700 transition-all active:scale-95"
              >
                🧹 Сбросить сохранение
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
