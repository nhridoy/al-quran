import { Component } from "react";
import { BiErrorCircle } from "react-icons/bi";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <BiErrorCircle className="text-5xl text-error" />
          <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
            Something went wrong
          </h2>
          <p className="max-w-md text-sm text-text-muted dark:text-dark-text-muted">
            {this.state.error?.message ?? "An unexpected error occurred"}
          </p>
          <button
            onClick={this.handleRetry}
            type="button"
            className="cursor-pointer rounded-xl bg-linear-to-br from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
