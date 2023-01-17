import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext=createContext();

const ChatProvider=({children})=>{
  const[user,setUser]=useState();
  const[selectedChat,setSelectedChat]=useState();
  const[chats,setChats]=useState([]);
  const history=useHistory();
  const [notification,setNotification]=useState([]);
  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));
    // console.log(user)
    setUser(userInfo);
    if(!userInfo){
        // history.push("/");
        // console.log(history)
    }
  },[history]);


    return( <ChatContext.Provider
       value={{user,setUser,setSelectedChat,selectedChat,chats,setChats,notification,setNotification}}>{children}</ChatContext.Provider> 
)};
export const ChatState=()=>{
    return useContext(ChatContext);
}
//  useContext(ChatContext);

export default ChatProvider;
