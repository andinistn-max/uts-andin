import { createContext, useContext, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [list, setList] = useLocalStorage("kopiku-notifications", []);

  const add = useCallback(
    (message) =>
      setList((l) =>
        [{ id: Date.now() + Math.random(), message, at: Date.now(), read: false }, ...l].slice(0, 50)
      ),
    [setList]
  );
  const markAllRead = () => setList((l) => l.map((n) => ({ ...n, read: true })));
  const clear = () => setList([]);
  const unread = list.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ list, unread, add, markAllRead, clear }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
