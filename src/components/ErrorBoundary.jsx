import { Component } from "react";
import { RotateCcw } from "lucide-react";

// Without this, any uncaught render error anywhere in the tree unmounts the
// whole app to a blank screen with no way back short of a manual reload —
// that's the "it crashed once" report. This turns that into a recoverable
// screen instead.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--vco-bg)] px-6 text-center text-[var(--vco-text)]">
          <p className="text-[15px] font-extrabold">Something went wrong</p>
          <p className="max-w-[260px] text-[12.5px] text-[var(--vco-text-muted)]">
            Sorry about that — your saved acts and settings are safe. Reload to keep going.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="tap flex items-center gap-1.5 rounded-xl bg-[var(--vco-green)] px-4 py-2.5 text-[13px] font-bold text-white"
          >
            <RotateCcw size={14} />
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
