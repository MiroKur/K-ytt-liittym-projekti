import { useEffect, useState } from "react";
// Both abort and the active guard prevent outdated responses from replacing newer data.
export function useResource(loader, keys) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ status: "loading", data: null });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ status: "loading", data: null });
    loader(controller.signal)
      .then((data) => {
        if (active) setState({ status: "success", data });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError")
          setState({ status: "error", data: null });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [...keys, attempt]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}
