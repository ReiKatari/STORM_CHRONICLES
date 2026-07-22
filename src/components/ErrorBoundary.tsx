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
    console.error('Uncaught error:', error);
  }

  public handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-slate-900 border border-red-500/50 p-6 rounded-2xl max-w-md shadow-2xl space-y-4">
            <span className="text-4xl">⚠️</span>
            <h2 className="text-xl font-bold text-red-400">Обнаружено устаревшее сохранение</h2>
            <p className="text-xs text-slate-300">
              {this.state.error?.message || 'Версия сохранения в браузере обновилась.'}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95"
            >
              🔄 Очистить сохраненные данные и запустить
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
