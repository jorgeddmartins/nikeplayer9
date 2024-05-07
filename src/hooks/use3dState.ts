import { useState, useEffect } from 'react';
import Store from '../3d/store';

export default function use3dState<T>(store: Store<T>): T {
  const [value, setValue] = useState<T>(store.value);

  useEffect(() => {
    const listener = (newValue: T) => {
      setValue(newValue);
    };

    // Listen to updates
    store.onChange(listener);

    // make sure we're in sync if changing stores
    if (value !== store.value) {
      setValue(store.value);
    }

    return () => {
      store.removeListener(listener);
    };
  }, [store, value]);

  return value;
}
