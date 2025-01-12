import React, { createContext, useState, ReactNode } from "react";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  user: { id: number; email: string; username: string; type: string } | null;
  setUser: (
    user: { id: number; email: string; username: string; type: string } | null
  ) => void;
  chatId: number | null;
  setChatId: (chatId: number | null) => void;
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
  onlineUsers: Set<number>;
  setOnlineUsers: (users: Set<number>) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
  chatId: null,
  setChatId: () => {},
  notifications: [],
  setNotifications: () => {},
  onlineUsers: new Set(),
  setOnlineUsers: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<{
    id: number;
    email: string;
    username: string;
    type: string;
  } | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null
  );
  const [chatId, setChatId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: (token: string | null) => {
          if (token) {
            localStorage.setItem("token", token);
          } else {
            localStorage.removeItem("token");
          }
          setToken(token);
        },
        user,
        setUser: (
          user: {
            id: number;
            email: string;
            username: string;
            type: string;
          } | null
        ) => {
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            localStorage.removeItem("user");
          }
          setUser(user);
        },
        chatId,
        setChatId: (chatId: number | null) => setChatId(chatId),
        notifications,
        setNotifications,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
