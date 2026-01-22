import { useCallback, useMemo, useSyncExternalStore } from "react"

// Subscribe to storage events (fires when other tabs modify localStorage)
const subscribeToStorage = (callback: () => void) => {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

export function useChatDraft(chatId: string | null) {
  const storageKey = chatId ? `chat-draft-${chatId}` : "chat-draft-new"

  // Memoize getSnapshot to avoid unnecessary re-subscriptions
  const getSnapshot = useMemo(
    () => () => localStorage.getItem(storageKey) ?? "",
    [storageKey]
  )

  // Server always returns empty string for consistent SSR
  const getServerSnapshot = useCallback(() => "", [])

  // Use useSyncExternalStore for hydration-safe localStorage access
  const storedValue = useSyncExternalStore(
    subscribeToStorage,
    getSnapshot,
    getServerSnapshot
  )

  const setDraftValue = useCallback(
    (value: string) => {
      if (value) {
        localStorage.setItem(storageKey, value)
      } else {
        localStorage.removeItem(storageKey)
      }
      // Trigger a storage event for same-tab listeners
      window.dispatchEvent(new StorageEvent("storage", { key: storageKey }))
    },
    [storageKey]
  )

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey)
    window.dispatchEvent(new StorageEvent("storage", { key: storageKey }))
  }, [storageKey])

  return {
    draftValue: storedValue,
    setDraftValue,
    clearDraft,
  }
}
