import React, { useState, useContext } from "react";
import { Box, Button, TextField, Modal, Typography } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { API_BASE_URL } from '../config';

interface LoginFormProps {
	open: boolean;
	onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ open, onClose }) => {
	const [emailOrUsername, setEmailOrUsername] = useState("");
	const [password, setPassword] = useState("");
	const { setToken, setUser, setChatId } = useContext(AuthContext);

	const handleLogin = async () => {
		try {
			const response = await axios.post(`${API_BASE_URL}/authenticate`, {
				emailOrUsername,
				password,
			});
			const { token, user } = response.data;

			setToken(token);
			setUser(user);

			const chatResponse = await axios.get(
				`${API_BASE_URL}/chat/${user.id}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			console.log("Resposta do chat:", chatResponse);

			let chatId;
			if (chatResponse.status === 200 && chatResponse.data.chat) {
				chatId = chatResponse.data.chat.id;
			} else {
				const createChatResponse = await axios.post(
					`${API_BASE_URL}/chat/create`,
					{ name: emailOrUsername, attendantId: 5, clientId: user.id },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				chatId = createChatResponse.data.chat.id;
			}
			setChatId(chatId);
			onClose();
		} catch (error) {
			console.error("Erro ao fazer login:", error);
		}
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={{ ...modalStyles, width: 400 }}>
				<Typography variant="h6" gutterBottom>
					Entrar
				</Typography>
				<TextField
					fullWidth
					label="Email ou Username"
					value={emailOrUsername}
					onChange={(e) => setEmailOrUsername(e.target.value)}
					margin="normal"
				/>
				<TextField
					fullWidth
					label="Senha"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					margin="normal"
				/>
				<Button
					variant="contained"
					color="primary"
					fullWidth
					onClick={handleLogin}>
					Entrar
				</Button>
			</Box>
		</Modal>
	);
};

const modalStyles = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

export default LoginForm;
