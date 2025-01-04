import React, { useContext, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { AuthContext } from "../context/auth-context";

const showBrowserNotification = (title: string, body: string) => {
	if (typeof window !== "undefined" && "Notification" in window) {
		if (Notification.permission === "granted") {
			new Notification(title, { body });
		} else if (Notification.permission !== "denied") {
			Notification.requestPermission().then((permission) => {
				if (permission === "granted") {
					new Notification(title, { body });
				}
			});
		}
	}
};

const NotificationComponent: React.FC = () => {
	const { notifications, setNotifications, user } = useContext(AuthContext);

	useEffect(() => {
		if (notifications.length > 0) {
			const timer = setTimeout(() => {
				setNotifications([]);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [notifications, setNotifications]);

	const relevantNotifications = notifications.filter(
		(notification) => notification.message.userId !== user?.id
	);

	useEffect(() => {
		relevantNotifications.forEach((notification) => {
			showBrowserNotification(
				`Nova mensagem no chat ${notification.chatId}`,
				notification.message.content
			);
		});
	}, [relevantNotifications]);

	return (
		<Box sx={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}>
			{relevantNotifications.map((notification, index) => (
				<Paper
					key={index}
					sx={{ mb: 1, p: 2, backgroundColor: "#ffc107", color: "#000" }}>
					<Typography variant="body1">
						Nova mensagem no chat {notification.chatId}
					</Typography>
					<Typography variant="body2">
						{notification.message.content}
					</Typography>
				</Paper>
			))}
		</Box>
	);
};

export default NotificationComponent;
