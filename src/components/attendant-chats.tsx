import React, { useEffect, useRef, useState, useContext } from "react";
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	TextField,
	Button,
	Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux";
import {
	fetchChats,
	fetchMessages,
	setSelectedChat,
	addMessage,
	addChat,
} from "../redux/slices/chat-slice";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { API_BASE_URL } from '../config';

interface Chat {
	id: number;
	name: string;
	clientId: number;
}

interface Message {
	userId: number;
	chatId: number;
	content: string;
	createdAt: string;
}

const socket: Socket = io(`${API_BASE_URL}`, {
	transports: ["websocket", "polling"],
	withCredentials: true,
});

const AttendantChats: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const theme = useTheme();
	const { token, user } = useSelector((state: RootState) => state.auth);
	const { chats, selectedChat, messages } = useSelector(
		(state: RootState) => state.chat
	);
	const [newMessage, setNewMessage] = useState("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const { onlineUsers } = useContext(AuthContext);

	useEffect(() => {
		if (user && user.type === "attendant") {
			console.log("Fetching chats for attendant...");
			dispatch(fetchChats());
			socket.on("newChat", (chat: Chat) => {
				dispatch(addChat(chat));
			});

			return () => {
				socket.off("newChat");
			};
		}
	}, [user, dispatch]);

	useEffect(() => {
		if (selectedChat) {
			dispatch(fetchMessages(selectedChat.id));
			socket.emit("joinChat", selectedChat.id);

			socket.on("message", (msg: Message) => {
				dispatch(addMessage(msg));
			});

			return () => {
				socket.off("message");
			};
		}
	}, [selectedChat, dispatch]);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const handleSendMessage = async () => {
		if (newMessage.trim() !== "" && selectedChat) {
			const messageData = {
				chatId: selectedChat.id,
				content: newMessage,
				userId: user?.id,
			};
			try {
				await axios.post(`${API_BASE_URL}/messages`, messageData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setNewMessage("");
			} catch (error) {
				console.error("Erro ao enviar a mensagem:", error);
			}
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			handleSendMessage();
		}
	};

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			<List
				sx={{
					width: "250px",
					borderRight: `1px solid ${theme.palette.divider}`,
				}}>
				{chats.length > 0 ? (
					chats.map((chat) => (
						<ListItem
							button
							key={chat.id}
							selected={selectedChat?.id === chat.id}
							onClick={() => dispatch(setSelectedChat(chat))}
							sx={{
								backgroundColor:
									selectedChat?.id === chat.id
										? theme.palette.action.selected
										: "inherit",
								"&:hover": {
									backgroundColor: theme.palette.action.hover,
								},
							}}>
							<ListItemText
								primary={chat.name}
								secondary={
									onlineUsers.has(chat.clientId) ? "Online" : "Offline"
								}
							/>
						</ListItem>
					))
				) : (
					<Typography variant="body1">Nenhum chat encontrado</Typography>
				)}
			</List>
			<Box
				sx={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
					backgroundColor: theme.palette.background.default,
				}}>
				<Typography
					variant="h6"
					sx={{
						p: 2,
						borderBottom: `1px solid ${theme.palette.divider}`,
						position: "sticky",
						top: 0,
						backgroundColor: theme.palette.background.paper,
						zIndex: 1,
					}}>
					{selectedChat ? selectedChat.name : "Selecione um chat"}
				</Typography>
				<Box sx={{ flexGrow: 1, p: 2, overflowY: "auto", mb: 10 }}>
					{selectedChat ? (
						messages.map((msg: Message, index: number) => (
							<Box
								key={index}
								sx={{
									mb: 1,
									textAlign: msg.userId === user?.id ? "right" : "left",
								}}>
								<Typography
									variant="body2"
									sx={{
										backgroundColor:
											msg.userId === user?.id
												? theme.palette.primary.light
												: theme.palette.background.paper,
										display: "inline-block",
										padding: "5px 10px",
										borderRadius: "5px",
									}}>
									{msg.content}
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: theme.palette.text.secondary }}>
									{new Date(msg.createdAt).toLocaleTimeString()}
								</Typography>
							</Box>
						))
					) : (
						<Typography variant="body1">Nenhum chat selecionado</Typography>
					)}
					<div ref={messagesEndRef} />
				</Box>
				{selectedChat && (
					<Paper
						sx={{
							p: 2,
							borderTop: `1px solid ${theme.palette.divider}`,
							position: "fixed",
							bottom: 0,
							width: "calc(100% - 250px)", // Adjust width to consider the width of the chat list
							backgroundColor: theme.palette.background.paper,
							zIndex: 1,
						}}>
						<Box sx={{ display: "flex", gap: 1 }}>
							<TextField
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								onKeyDown={handleKeyDown}
								fullWidth
								size="small"
								placeholder="Digite uma mensagem..."
								InputProps={{
									style: { color: theme.palette.text.primary },
								}}
							/>
							<Button
								variant="contained"
								color="primary"
								onClick={handleSendMessage}>
								Enviar
							</Button>
						</Box>
					</Paper>
				)}
			</Box>
		</Box>
	);
};

export default AttendantChats;
