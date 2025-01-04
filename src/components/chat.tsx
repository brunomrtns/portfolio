import React, { useEffect, useState, useContext, useRef } from "react";
import io, { Socket } from "socket.io-client";
import {
	Box,
	TextField,
	Button,
	Typography,
	Paper,
	IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthModal from "./auth-modal";
import { AuthContext } from "../context/auth-context";
import axios from "axios";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { API_BASE_URL } from '../config';

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

const Chat: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [isModalOpen, setModalOpen] = useState(false);
	const { token, user, setChatId, chatId } = useContext(AuthContext);
	const theme = useTheme();
	const [isMinimized, setIsMinimized] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const initializeChat = async () => {
			if (user && !chatId) {
				const chatId = await getChatId(user.id);
				if (chatId) {
					socket.emit("joinChat", chatId);
					setChatId(chatId);

					const chatMessages = await loadMessages(chatId);
					setMessages(chatMessages);

					socket.on("message", (msg: Message) => {
						setMessages((prevMessages) => [...prevMessages, msg]);
					});
				}
			}
		};

		initializeChat();

		return () => {
			socket.off("message");
		};
	}, [user]);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const getChatId = async (clientId: number) => {
		try {
			const response = await axios.get(
				`${API_BASE_URL}/chat/${clientId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			return response.data.chat.id;
		} catch (error) {
			console.error("Erro ao obter chat:", error);
			return null;
		}
	};

	const loadMessages = async (chatId: number) => {
		try {
			const response = await axios.get(
				`${API_BASE_URL}/chat/${chatId}/messages`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			return response.data.sort(
				(a: Message, b: Message) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			);
		} catch (error) {
			console.error("Erro ao carregar mensagens:", error);
			return [];
		}
	};

	const handleSendMessage = async () => {
		if (newMessage.trim() !== "" && user && chatId) {
			const messageData = { chatId, content: newMessage, userId: user.id };
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
		<>
			<Box
				sx={{
					position: "fixed",
					bottom: 20,
					right: 20,
					zIndex: 1000,
				}}>
				{isMinimized ? (
					<Paper
						elevation={3}
						sx={{
							width: "320px",
							height: "60px",
							borderRadius: "10px",
							backgroundColor: theme.palette.background.default,
							boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
							p: 2,
						}}>
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<Typography variant="h6" gutterBottom>
								Chat
							</Typography>
							<IconButton
								onClick={() => setIsMinimized(!isMinimized)}
								sx={{ color: theme.palette.text.primary }}>
								<ExpandMoreIcon />
							</IconButton>
						</Box>
					</Paper>
				) : (
					<ResizableBox
						width={320}
						height={400}
						minConstraints={[300, 120]}
						maxConstraints={[600, 600]}
						resizeHandles={["nw"]}>
						<Paper
							elevation={3}
							sx={{
								width: "100%",
								height: "100%",
								borderRadius: "10px",
								backgroundColor: theme.palette.background.default,
								boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
								p: 2,
								position: "relative",
								display: "flex",
								flexDirection: "column",
								paddingBottom: "45px",
							}}>
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography variant="h6" gutterBottom>
									Chat
								</Typography>
								<IconButton
									onClick={() => setIsMinimized(!isMinimized)}
									sx={{ color: theme.palette.text.primary }}>
									<ExpandLessIcon />
								</IconButton>
							</Box>
							{!isMinimized && (
								<>
									{!user ? (
										<Button
											variant="contained"
											color="primary"
											fullWidth
											onClick={() => setModalOpen(true)}>
											Fale comigo
										</Button>
									) : (
										<>
											<Box
												sx={{
													flex: 1,
													overflowY: "auto",
													mb: 2,
												}}>
												{messages.map((msg, index) => (
													<Box
														key={index}
														sx={{
															mb: 1,
															textAlign:
																msg.userId === user.id ? "right" : "left",
														}}>
														<Typography
															variant="body2"
															sx={{
																backgroundColor:
																	msg.userId === user.id
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
												))}
												<div ref={messagesEndRef} />
											</Box>
											<Box
												sx={{
													display: "flex",
													gap: 1,
													position: "absolute",
													bottom: 0,
													left: 0,
													right: 0,
													p: 2,
													// backgroundColor: theme.palette.background.default,
													alignItems: "center",
												}}>
												<TextField
													value={newMessage}
													onChange={(e) => setNewMessage(e.target.value)}
													onKeyDown={handleKeyDown}
													fullWidth
													size="small"
													placeholder="Digite uma mensagem..."
												/>
												<Button
													variant="contained"
													color="primary"
													onClick={handleSendMessage}>
													Enviar
												</Button>
											</Box>
										</>
									)}
								</>
							)}
						</Paper>
					</ResizableBox>
				)}
			</Box>
			<AuthModal open={isModalOpen} onClose={() => setModalOpen(false)} />
		</>
	);
};

export default Chat;
