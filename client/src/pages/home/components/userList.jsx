import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import { createChat } from "../../../apiCalls/chats";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/usersSlice";
import moment from 'moment';
import { useEffect } from "react";
import store from "../../../redux/store";

function UserList({ searchKey , socket , onlineUser}) {
    const { allUsers, allChats, user: currentUser, selectedChat } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    const users = Array.isArray(allUsers[0]) ? allUsers[0] : allUsers;

    const chats = Array.isArray(allChats[0]) ? allChats[0] : allChats;


    const startNewChat = async (searchedUserId) => {
        let response = null;
        try {
            dispatch(showLoader());
            response = await createChat([currentUser._id, searchedUserId]);
            dispatch(hideLoader());
            if (response.status === 'success') {
                toast.success(response.message);
                const newChat = response.data;
                const updatedChats = [...chats, newChat];
                dispatch(setAllChats(updatedChats));
                dispatch(setSelectedChat(newChat))
            }

        } catch (error) {
            toast.error(response.message)
            dispatch(hideLoader());
        }

    }
    const openChat = (selectedUserId) => {
        const chat = chats.find(chat =>
            chat.members.map(m => m._id).includes(currentUser._id) &&
            chat.members.map(m => m._id).includes(selectedUserId)
        )

        if (chat) {
            dispatch(setSelectedChat(chat));

        }


    }
    const isSelectedChat = (user) => {
        if (selectedChat) {
            return selectedChat.members.map(m => m._id).includes(user._id);
        }
        return false;
    }
    function getlastMessageTimestamp(userId) {
        const chat = chats.find(chat => chat.members.map(m => m._id).includes(userId));
        if (!chat || !chat?.lastMessage) {
            return "";
        } else {
            return moment(chat?.lastMessage?.createdAt).format('hh:mm A')
        }
    }

    function formetName(user) {
        let fname = user.firstName.at(0).toUpperCase() + user.firstName.slice(1).toLowerCase();
        let lname = user.lastName.at(0).toUpperCase() + user.lastName.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }
    const getlastMessage = (userId) => {
        const chat = chats.find(chat => chat.members.map(m => m._id).includes(userId));
        if (!chat || !chat?.lastMessage) {
            return "";
        } else {
            const msgPrifix = chat?.lastMessage?.sender === currentUser._id ? "You: " : "";
            return msgPrifix + chat?.lastMessage?.text?.substring(0, 25);

        }
    }

    function getUnreadMessages(userId) {
        const chat = chats.find(chat => chat.members.map(m => m._id).includes(userId));
        if (chat && chat.unreadMessageCount && chat.lastMessage.sender !== currentUser._id) {
            return <div className="unread-message-counter">{chat.unreadMessageCount}</div>
        } else {
            return "";
        }
    }
    function getData() {
        if (searchKey === "") {
            return chats;
        } else {
            return users.filter(user => {
                return user.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
                    user.lastName.toLowerCase().includes(searchKey.toLowerCase())
            })
        }
    }

    useEffect(()=>{
        socket.off('set-message-count').on('set-message-count',(message)=>{
            const selectedChat = store.getState().userReducer.selectedChat;
            let allChats = store.getState().userReducer.allChats;
            if(selectedChat?._id !== message.chatId){
                const updatedChat = allChats.map(chat =>{
                    if(chat._id === message.chatId){
                        return{
                            ...chat,
                            unreadMessageCount:(chat?.unreadMessageCount || 0) +1,
                            lastMessage:message
                        }
                    }
                    return chat;
                })
               allChats = updatedChat;
            }

            //FIND THE LSTEST CHAT 
            const latestChat = allChats.find( chat=> chat._id === message.chatId);
            //FIND THE OTHER CHATS 
            const otherChats = allChats.filter( chat => chat._id !== message.chatId);
            allChats = [latestChat, ...otherChats];
            
            dispatch(setAllChats(allChats));
        })
    })
    return (
        getData()?.map(obj => {
            let user = obj;
            if(obj.members){
                user= obj.members.find(mem => mem._id !== currentUser._id);
            }
            return <div className="user-search-filter" key={user._id} onClick={() => openChat(user._id)}>
                <div className={isSelectedChat(user) ? "selected-user" : "filtered-user"} >
                    <div className="filter-user-display">
                    {user?.profilePic && <img src={user?.profilePic} alt="profile pic" 
                    className={isSelectedChat(user) ? "user-selected-avatar" : "user-default-avatar"}
                    style={onlineUser.includes(user._id) ? {border:'#82e0aa 3px solid'} : {}}
                    ></img>}
                       { !user?.profilePic && <div className={isSelectedChat(user) ? "user-selected-avatar" : "user-default-avatar"}
                         style={onlineUser.includes(user._id) ? {border:'#82e0aa 3px solid'} : {}}
                        >
                            {
                                user.firstName.charAt(0).toUpperCase() +
                                user.lastName.charAt(0).toUpperCase()
                            }
                        </div>}
                        <div className="filter-user-details">
                            <div className="user-display-name">{formetName(user)}</div>
                            <div className="user-display-email">{getlastMessage(user._id) || user.email}</div>
                        </div>
                        <div>
                            {getUnreadMessages(user._id)}
                            <div className="last-message-timestamp">{getlastMessageTimestamp(user._id)}</div>
                        </div>
                        {
                            (!chats.find(chat => chat.members.map(m => m._id).includes(user._id))) &&

                            <div className="user-start-chat">
                                <button className="user-start-chat-btn " onClick={() => startNewChat(user._id)}>Start Chat</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        
    }
    )
    )
}

export default UserList;
