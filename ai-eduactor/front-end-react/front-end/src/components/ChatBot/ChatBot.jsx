import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import './ChatBot.css';
import CustomNavbar from '../app-custom/CustomNavbar';

function formatAttachmentName(filename) {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    return nameWithoutExt
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_\-]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
}

const ChatBot = () => {
    const location = useLocation();
    const { attachments = [], courseId, courseName } = location.state || {};

    const initialChatHistory = attachments.map(att => ({
        id: att.id,
        title: formatAttachmentName(att.originalFileName),
        messages: []
    }));

    const [chatHistory, setChatHistory] = useState(initialChatHistory);
    const [selectedAttachmentId, setSelectedAttachmentId] = useState(
        attachments.length > 0 ? attachments[0].id : null
    );
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const selectedChat = chatHistory.find(chat => chat.id === selectedAttachmentId);
    const messages = selectedChat ? selectedChat.messages : [];

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedAttachmentId]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === '' || !selectedAttachmentId) return;

        const userMessage = { text: inputValue, isUser: true, timestamp: new Date() };
        setChatHistory(prevHistory =>
            prevHistory.map(chat =>
                chat.id === selectedAttachmentId
                    ? { ...chat, messages: [...chat.messages, userMessage] }
                    : chat
            )
        );
        setInputValue('');

        try {
            const loadingMessage = { text: "Thinking...", isUser: false, timestamp: new Date(), isLoading: true };
            setChatHistory(prevHistory =>
                prevHistory.map(chat =>
                    chat.id === selectedAttachmentId
                        ? { ...chat, messages: [...chat.messages, loadingMessage] }
                        : chat
                )
            );

            const response = await fetch('http://localhost:8000/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: userMessage.text,
                    pdf_id: selectedAttachmentId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get answer from chatbot');
            }

            const data = await response.json();

            setChatHistory(prevHistory =>
                prevHistory.map(chat =>
                    chat.id === selectedAttachmentId
                        ? {
                            ...chat,
                            messages: [
                                ...chat.messages.filter(msg => !msg.isLoading),
                                { text: data.Answer, isUser: false, timestamp: new Date() }
                            ]
                        }
                        : chat
                )
            );
        } catch (error) {
            setChatHistory(prevHistory =>
                prevHistory.map(chat =>
                    chat.id === selectedAttachmentId
                        ? {
                            ...chat,
                            messages: [
                                ...chat.messages.filter(msg => !msg.isLoading),
                                { text: "Sorry, there was an error getting a response.", isUser: false, timestamp: new Date() }
                            ]
                        }
                        : chat
                )
            );
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const selectAttachment = (attId) => {
        setSelectedAttachmentId(attId);
    };

    return (
        <div className="chat-page">
            <CustomNavbar />

            <div className="chat-interface">
                <div className="chat-sidebar">
                    <div className="chat-history">
                        <h3>Chat History</h3>
                        <ul>
                            {chatHistory.map((chat) => (
                                <li
                                    key={chat.id}
                                    className={selectedAttachmentId === chat.id ? 'active' : ''}
                                    onClick={() => selectAttachment(chat.id)}
                                >
                                    <div className="chat-title">{chat.title}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <h2>
                            {selectedChat
                                ? `${selectedChat.title}`
                                : "Select a chat history to begin."}
                        </h2>
                    </div>

                    <div className="chatbot-messages">
                        {messages.length === 0 ? (
                            <div className="empty-chat">
                                <p>Ask me anything about your studies!</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
                                >
                                    <div className="message-bubble">
                                        {message.text}
                                    </div>
                                    <div className="message-time">
                                        {message.timestamp instanceof Date
                                            ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : message.timestamp}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-container">
                        <div className="chatbot-input">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message here..."
                                disabled={!selectedChat}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={inputValue.trim() === '' || !selectedChat}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
