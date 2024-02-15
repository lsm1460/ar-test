import { useEffect, useState } from "react";

export function useScript(src: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let script = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
    }

    const handleLoad = () => setLoading(false);
    const handleError = (error: ErrorEvent) => setError(error.message);

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [src]);

  return [loading, error];
}
