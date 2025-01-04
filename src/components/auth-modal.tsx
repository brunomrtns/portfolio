import React, { useState, useContext } from "react";
import { Box, Button, TextField, Modal, Typography } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import io, { Socket } from "socket.io-client";
import { API_BASE_URL } from '../config';

const socket: Socket = io(`${API_BASE_URL}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { setToken, setUser, setChatId } = useContext(AuthContext);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        const response = await axios.post(
          `${API_BASE_URL}/authenticate`,
          {
            emailOrUsername: email,
            password,
          },
        );
        const { token, user } = response.data;
        setToken(token);
        setUser(user);

        if (user?.type === "client") {
          const chatResponse = await axios.get(
            `${API_BASE_URL}/chat/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          let chatId;
          if (chatResponse.status === 200 && chatResponse.data.chat) {
            chatId = chatResponse.data.chat.id;
          } else {
            const createChatResponse = await axios.post(
              `${API_BASE_URL}/chat/create`,
              { name: email, attendantId: 5, clientId: user.id },
              { headers: { Authorization: `Bearer ${token}` } },
            );
            chatId = createChatResponse.data.chat.id;
          }
          setChatId(chatId);
          socket.emit("joinChat", chatId);
        }
      } else {
        const createResponse = await axios.post(
          `${API_BASE_URL}/users/create`,
          {
            name,
            username,
            email,
            password,
            type: "client",
          },
        );

        if (createResponse.status === 201) {
          const authResponse = await axios.post(
            `${API_BASE_URL}/authenticate`,
            {
              emailOrUsername: email,
              password,
            },
          );
          const { token, user } = authResponse.data;
          setToken(token);
          setUser(user);

          const chatResponse = await axios.post(
            `${API_BASE_URL}/chat/create`,
            { name: email, attendantId: 1, clientId: user.id },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          const chatId = chatResponse.data.chat.id;
          setChatId(chatId);
          socket.emit("joinChat", chatId);
        }
      }
      onClose();
    } catch (error) {
      console.error("Erro ao autenticar:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyles, width: 400 }}>
        <Typography variant="h6" gutterBottom>
          {isLogin ? "Login" : "Cadastro"}
        </Typography>
        {!isLogin && (
          <TextField
            fullWidth
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
        )}
        {!isLogin && (
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
        )}
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onClick={handleAuth}
        >
          {isLogin ? "Entrar" : "Cadastrar"}
        </Button>
        <Button
          variant="text"
          fullWidth
          onClick={() => setIsLogin(!isLogin)}
          sx={{ mt: 2 }}
        >
          {isLogin
            ? "Não tem uma conta? Cadastre-se"
            : "Já tem uma conta? Entre"}
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

export default AuthModal;
