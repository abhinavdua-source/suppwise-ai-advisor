import { useSyncExternalStore } from "react";
import { INITIAL_STACK, type Supplement } from "@/data/wisement";

let stack: Supplement[] = INITIAL_STACK;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStack() {
  return useSyncExternalStore(
    subscribe,
    () => stack,
    () => stack,
  );
}

export function addToStack(item: Supplement) {
  if (stack.some((s) => s.id === item.id)) return;
  stack = [...stack, item];
  emit();
}

export function removeFromStack(id: string) {
  stack = stack.filter((s) => s.id !== id);
  emit();
}

export function toggleReminder(id: string) {
  stack = stack.map((s) => (s.id === id ? { ...s, reminder: !s.reminder } : s));
  emit();
}

export function isInStack(id: string) {
  return stack.some((s) => s.id === id);
}
