type Hook<T> = (newValue: T, oldValue: T) => void;

export default class Store<T> {
  value: T;
  initialValue: T;
  hooks: Set<Hook<T>>;
  blocked: boolean;

  constructor(initialValue: T) {
    this.value = initialValue;
    this.initialValue = initialValue;
    this.hooks = new Set();
    this.blocked = false;
  }

  set(value: T) {
    // Not allowed to write right now
    if (this.blocked) return;

    // Set new value
    const oldValue = this.value;
    this.value = value;

    // run all hooks
    this.hooks.forEach(h => h(value, oldValue));
  }

  setFn(fn: (curr: T) => T) {
    this.set(fn(this.value));
  }

  block(block = true) {
    this.blocked = block;
  }

  onChange(hook: Hook<T>) {
    this.hooks.add(hook);
  }

  removeListener(hook: Hook<T>) {
    this.hooks.delete(hook);
  }

  reset() {
    this.set(this.initialValue);
  }
}
