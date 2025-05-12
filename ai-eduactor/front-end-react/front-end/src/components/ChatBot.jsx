import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import CustomNavbar from './CustomNavbar';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { id: 1, title: "Previous Chat 1", date: "May 8, 2025", messages: [
                { text: "This is a previous message from chat 1", isUser: false, timestamp: new Date(2025, 4, 8, 14, 30) },
                { text: "Here's my question about that topic", isUser: true, timestamp: new Date(2025, 4, 8, 14, 31) },
                { text: "And here's the AI response to your question", isUser: false, timestamp: new Date(2025, 4, 8, 14, 32) }
            ]},
        { id: 2, title: "Math Questions", date: "May 9, 2025", messages: [
                { text: "How do I solve quadratic equations?", isUser: true, timestamp: new Date(2025, 4, 9, 10, 15) },
                { text: "To solve a quadratic equation ax² + bx + c = 0, you can use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a", isUser: false, timestamp: new Date(2025, 4, 9, 10, 16) }
            ]},
        { id: 3, title: "Physics Help", date: "May 10, 2025", messages: [
                { text: "Can you explain Newton's laws of motion?", isUser: true, timestamp: new Date(2025, 4, 10, 9, 45) },
                { text: "Newton's First Law: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. Newton's Second Law: F = ma (force equals mass times acceleration). Newton's Third Law: For every action, there is an equal and opposite reaction.", isUser: false, timestamp: new Date(2025, 4, 10, 9, 46) }
            ]}
    ]);
    const [activeChat, setActiveChat] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        const newMessage = { text: inputValue, isUser: true, timestamp: new Date() };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInputValue('');

        setTimeout(() => {
            const botResponse = {
                text: "This is a sample response from AI Educator. In a real implementation, this would be connected to an AI API.",
                isUser: false,
                timestamp: new Date()
            };
            const finalMessages = [...updatedMessages, botResponse];
            setMessages(finalMessages);

            if (activeChat !== null) {
                setChatHistory(prevHistory =>
                    prevHistory.map(chat =>
                        chat.id === activeChat
                            ? {...chat, messages: finalMessages}
                            : chat
                    )
                );
            }
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const startNewChat = () => {
        const newChatId = chatHistory.length > 0 ? Math.max(...chatHistory.map(c => c.id)) + 1 : 1;
        const newChat = {
            id: newChatId,
            title: `New Chat ${newChatId}`,
            date: new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}),
            messages: []
        };

        setChatHistory([...chatHistory, newChat]);
        setMessages([]);
        setActiveChat(newChatId);
    };

    const selectChat = (chatId) => {
        const selectedChat = chatHistory.find(chat => chat.id === chatId);
        if (selectedChat) {
            setMessages(selectedChat.messages);
            setActiveChat(chatId);
        }
    };

    return (
        <div className="chat-page">
            <CustomNavbar />

            <div className="chat-interface">
                <div className="chat-sidebar">
                    <div className="new-chat-button" onClick={startNewChat}>
                        <button>+ New Chat</button>
                    </div>

                    <div className="chat-history">
                        <h3>Chat History</h3>
                        <ul>
                            {chatHistory.map((chat) => (
                                <li
                                    key={chat.id}
                                    className={activeChat === chat.id ? 'active' : ''}
                                    onClick={() => selectChat(chat.id)}
                                >
                                    <div className="chat-title">{chat.title}</div>
                                    <div className="chat-date">{chat.date}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <h2>AI Tutor Chat</h2>
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
                                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={inputValue.trim() === ''}
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
