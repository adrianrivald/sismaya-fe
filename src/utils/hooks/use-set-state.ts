import * as React from 'react';

export function useSetState<TData = Record<string, unknown>>(
  initialState: TData = {} as TData
) {
  return React.useReducer(
    (prevState: TData, nextState: Partial<TData>) => ({
      ...prevState,
      ...nextState,
    }),
    initialState
  );
}
