import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

interface UseStatusToastParams {
  message?: string | null;
  tone?: "error" | "success" | null;
}

export const useStatusToast = ({ message = null, tone = null }: UseStatusToastParams): void => {
  const previousToastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const nextToastKey = message && tone ? `${tone}:${message}` : null;

    if (!nextToastKey) {
      previousToastKeyRef.current = null;
      return;
    }

    if (previousToastKeyRef.current === nextToastKey) {
      return;
    }

    previousToastKeyRef.current = nextToastKey;

    if (tone === "success") {
      toast.success(message);
      return;
    }

    toast.error(message);
  }, [message, tone]);
};
