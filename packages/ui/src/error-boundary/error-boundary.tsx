"use client";

import * as React from "react";

interface Props<TError> {
  className?: string;
  children: React.ReactNode;
  fallback?:
    | (({
        error,
        reset,
      }: {
        error: TError | null;
        reset: () => void;
      }) => React.ReactNode)
    | React.ReactNode;
  onError?: (error: TError, errorInfo: React.ErrorInfo) => void;
  handleRetry?: ({
    error,
    reset,
  }: {
    error: TError | null;
    reset: () => void;
  }) => void;
}

interface State<TError> {
  hasError: boolean;
  error: TError | null;
}

export class ErrorBoundary<TError extends Error> extends React.Component<
  Props<TError>,
  State<TError>
> {
  public state: State<TError> = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: TError, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    this.setState({ error });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          {typeof this.props.fallback === "function"
            ? this.props.fallback({
                error: this.state.error,
                reset: () => {
                  this.setState({ hasError: false });
                  this.props.handleRetry?.({
                    error: this.state.error,
                    reset: () => this.setState({ hasError: false }),
                  });
                },
              })
            : this.props.fallback}
        </>
      );
    }

    return this.props.children;
  }
}
