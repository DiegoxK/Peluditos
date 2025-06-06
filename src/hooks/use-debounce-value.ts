import * as React from "react";

export function useDebouncedValueWithTransition<T>(
  value: T,
  delay: number,
): [T, boolean] {
  const [debouncedValue, setDebouncedValueInternal] = React.useState(value);
  const [isTransitionPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        setDebouncedValueInternal(value);
      });
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, startTransition]);

  return [debouncedValue, isTransitionPending];
}
