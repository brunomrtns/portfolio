import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";

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

interface ChatState {
	chats: Chat[];
	selectedChat: Chat | null;
	messages: Message[];
}

const initialState: ChatState = {
	chats: [],
	selectedChat: null,
	messages: [],
};

export const fetchChats = createAsyncThunk(
	"chat/fetchChats",
	async (_, { getState }) => {
		const state = getState() as RootState;
		const { token } = state.auth;
		try {
			const response = await axios.get("http://localhost:8080/chats", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error("Erro ao buscar chats: ", error);
			throw error;
		}
	}
);

export const fetchMessages = createAsyncThunk(
	"chat/fetchMessages",
	async (chatId: number, { getState }) => {
		const state = getState() as RootState;
		const { token } = state.auth;
		const response = await axios.get(
			`http://localhost:8080/chat/${chatId}/messages`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return response.data;
	}
);

const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setSelectedChat: (state, action) => {
			state.selectedChat = action.payload;
		},
		addMessage: (state, action) => {
			state.messages.push(action.payload);
		},
		addChat: (state, action) => {
			state.chats.push(action.payload);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchChats.fulfilled, (state, action) => {
			state.chats = action.payload;
		});
		builder.addCase(fetchMessages.fulfilled, (state, action) => {
			state.messages = action.payload;
		});
	},
});

export const { setSelectedChat, addMessage, addChat } = chatSlice.actions;

export default chatSlice.reducer;
