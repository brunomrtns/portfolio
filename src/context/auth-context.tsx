import React, { createContext, useState, ReactNode, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { API_BASE_URL } from '../config';

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

	useEffect(() => {
		const socket: Socket = io(`${API_BASE_URL}`, {
			transports: ["websocket", "polling"],
			withCredentials: true,
		});

		if (user) {
			socket.emit("registerUser", user.id);
		}

		socket.on("notification", (notification) => {
			setNotifications((prevNotifications) => [
				...prevNotifications,
				notification,
			]);
		});

		socket.on("userOnline", (userId: number) => {
			setOnlineUsers((prevOnlineUsers) => new Set(prevOnlineUsers).add(userId));
		});

		socket.on("userOffline", (userId: number) => {
			setOnlineUsers((prevOnlineUsers) => {
				const updatedUsers = new Set(prevOnlineUsers);
				updatedUsers.delete(userId);
				return updatedUsers;
			});
		});

		return () => {
			socket.off("notification");
			socket.off("userOnline");
			socket.off("userOffline");
		};
	}, [user]);

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
			}}>
			{children}
		</AuthContext.Provider>
	);
};
