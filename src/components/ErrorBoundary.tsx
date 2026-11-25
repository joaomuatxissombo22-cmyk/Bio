import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('Erro capturado na aplicação:', error);
  }

  handleRecover = () => {
    try {
      window.sessionStorage.removeItem('biosfera_chunk_reload');
    } catch {
      // Ignore storage restrictions
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F7F5] dark:bg-[#081410] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white dark:bg-[#0D1E17] border border-neutral-200 dark:border-[#224738] rounded-xl p-8">
            <h1 className="text-xl font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] mb-2">
              Ocorreu um erro inesperado
            </h1>
            <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] mb-6">
              Não foi possível carregar esta secção. Por favor, recarregue a página ou regresse ao início.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 text-sm font-medium bg-[#1B6B4A] text-white rounded-lg hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] transition-colors"
              >
                Recarregar Página
              </button>
              <button
                type="button"
                onClick={this.handleRecover}
                className="px-5 py-2.5 text-sm font-medium border border-neutral-300 dark:border-[#224738] text-[#182C61] dark:text-[#EAF4EE] rounded-lg hover:bg-neutral-100 dark:hover:bg-[#11261E] transition-colors"
              >
                Ir para o Início
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
