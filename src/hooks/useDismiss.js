import { useCallback, useState } from "react";

// Every modal/sheet already animates in nicely, but closing them just
// yanked them off screen instantly — no exit transition, since they're
// conditionally rendered and unmount the moment onClose fires. This plays
// a brief "-out" animation (see the paired CSS classes) before actually
// calling onClose, so closing feels as deliberate as opening.
export function useDismiss(onClose, duration = 180) {
  const [closing, setClosing] = useState(false);

  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, duration);
  }, [onClose, duration]);

  return { closing, dismiss };
}
