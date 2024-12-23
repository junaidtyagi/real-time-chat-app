import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";
import moment from 'moment';
import { clearUnreadMessageCount } from "../../../apiCalls/chats";
import store from './../../../redux/store'
import { setAllChats } from "../../../redux/usersSlice";
import EmojiPicker from 'emoji-picker-react';


function ChatArea({ socket }) {
    const dispatch = useDispatch();
    const { selectedChat, user: currentUser, allChats: chats } = useSelector(state => state.userReducer);
    const selectedUser = selectedChat.members.find(u => u._id !== currentUser._id)
    const [msg, setMsg] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [data , setData]= useState(null);
    const sendMessage = async (image) => {
        try {
            const message = {
                chatId: selectedChat._id,
                sender: currentUser._id,
                text: msg,
                image: image
            }
            socket.emit('send-message', {
                ...message,
                members: selectedChat.members.map(m => m._id),
                read: false,
                createdAt: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')

            })
            const response = await createNewMessage(message);

            if (response.status === 'success') {
                setMsg('');
                setShowEmojiPicker(false);
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const formetTime = (timestamp) => {
        const now = moment();
        const difference = now.diff(moment(timestamp), 'days');
        if (difference < 1) {
            return `Today ${moment(timestamp).format('hh.mm A')}`;
        } else if (difference === 1) {
            return `Yesterday ${moment(timestamp).format('hh.mm A')}`;
        } else {
            return moment(timestamp).format('MMM D, hh.mm A');
        }
    }
    const getMessages = async () => {
        try {

            dispatch(showLoader())
            const response = await getAllMessages(selectedChat._id);
            dispatch(hideLoader())
            if (response.status === 'success') {
                setAllMessages(response.data)
            }

        } catch (error) {
            dispatch(hideLoader())
            toast.error(error.message)
        }
    }
    const messageCount = async () => {
        try {

            socket.emit('clear-unread-messages', {
                chatId: selectedChat._id,
                members: selectedChat.members.map(m => m._id)
            })
            const response = await clearUnreadMessageCount(selectedChat._id);
            if (response.status === 'success') {
                chats.map(chat => {
                    if (chat._id === selectedChat._id) {
                        return response.data;
                    }
                    return chat;
                })
            }

        } catch (error) {
            toast.error(error.message)
        }
    }
    function formetName(user) {
        let fname = user?.firstName.at(0).toUpperCase() + user?.firstName.slice(1).toLowerCase();
        let lname = user?.lastName.at(0).toUpperCase() + user?.lastName.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }
    const sendImage = async (e)=>{
        const file = e.target.files[0];
        const reader = new FileReader(file);

        reader.readAsDataURL(file);

        reader.onloadend= async ()=>{
            sendMessage(reader.result)
        }
    }
    useEffect(() => {
        getMessages();
        if (selectedChat?.lastMessage?.sender !== currentUser._id) {
            messageCount();
        }
        socket.off('receive-message').on('receive-message', (message) => {
            const selectedChat = store.getState().userReducer.selectedChat;
            const user = store.getState().userReducer.user;
            if (selectedChat._id === message.chatId) {
                setAllMessages(prevmsg => [...prevmsg, message]);
            }
            if (selectedChat._id === message.chatId && message.sender !== user._id) {
                messageCount();
            }
        })

        socket.on('message-count-cleared', (data) => {
            // UPDATING UNREAD MESSAGE COUNT IN CHAT OBJECT
            const selectedChat = store.getState().userReducer.selectedChat;
            const allChats = store.getState().userReducer.allChats;
            if (selectedChat._id === data.chatId) {
                const updatedChats = allChats.map(chat => {
                    if (chat._id === data.chatId) {
                        return { ...chat, unreadMessageCount: 0 }
                    }
                    return chat;
                })
                dispatch(setAllChats(updatedChats))
                // UPDATING READ PROPERTY IN MESSAGE OBJECT
                setAllMessages(prevMsgs => {
                    return prevMsgs.map(msg => {
                        return { ...msg, read: true }
                    })
                })
            }
        })

        socket.on('started-typing', data => {
            setData(data);
            if (selectedChat._id === data.chatId && data.sender !== currentUser._id) {
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                }, 2000)
            }
        })
    }, [selectedChat])

    useEffect(() => {
        const msgContainer = document.getElementById('main-chat-area');
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, [allMessages, isTyping])
    return (
        <>{selectedChat && <div className="app-chat-area">
            <div className="app-chat-area-header">

                {formetName(selectedUser)}
            </div>
            <div className="main-chat-area" id="main-chat-area">
                {
                    allMessages.map(message => {
                        const isCurrentUserisSender = message.sender === currentUser._id;
                        return <div className="message-container" style={isCurrentUserisSender ? { justifyContent: 'end' } : { justifyContent: 'start' }} >
                            <div>
                                <div className={isCurrentUserisSender ? "send-message" : "received-message"}>
                                    <div>{message.text}</div>
                                    <div>{message.image && <img src={message.image} alt="image" height="120" width="120"></img>}</div>
                                </div>
                                <div className="message-timestamp" style={isCurrentUserisSender ? { float: 'right' } : { float: 'left' }}>
                                    {formetTime(message.createdAt)}{isCurrentUserisSender && message.read &&
                                        <i className="fa fa-check-circle" aria-hidden="true" style={{ color: '#e74c3c' }}></i>}
                                </div>
                            </div>
                        </div>
                    })
                }
                <div className="typing-indicator">{isTyping && selectedChat?.members.map(m => m._id).includes(data?.sender) && <i>typing...</i>}</div>
            </div>
            {showEmojiPicker && <div style={{width:'100%', display:'flex', padding:'0px 20px', justifyContent:'right'}}>
                <EmojiPicker style={{width:'300px', height:'350px'}} onEmojiClick={(e) => setMsg(msg + e.emoji)}></EmojiPicker>
            </div>}
            <div className="send-message-div">
                <input type="text" className="send-message-input"
                    placeholder="Type a message"
                    value={msg} onChange={(e) => {
                        setMsg(e.target.value)
                        socket.emit('user-typing', {
                            chatId: selectedChat._id,
                            members: selectedChat.members.map(m => m._id),
                            sender: currentUser._id
                        })
                    }} />
                <label htmlFor="file">
                    <i className="fa fa-picture-o send-image-btn"></i>
                    <input
                        type="file"
                        id="file"
                        style={{ display: 'none' }}
                        accept="image/jpg, image/png, image/jpeg, image/gif"
                        onChange={sendImage}
                    />
                </label>


                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="fa fa-smile-o send-emoji-btn"
                    aria-hidden="true">
                </button>
                <button onClick={()=> sendMessage('')}
                    className="fa fa-paper-plane send-message-btn"
                    aria-hidden="true">
                </button>
            </div>
        </div>}</>
    )
}
export default ChatArea;