import { Box, FormControl, IconButton ,Input,Menu, Spinner} from '@chakra-ui/react';
import React, { useEffect, useState} from 'react'
import { useToast } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { Toast } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender ,getSenderFull} from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import { io } from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";

const ENDPOINT="http://localhost:5001";
var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
const toast = useToast();


  const [messages,setMessages]=useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  //console.log(ChatState())
  const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings:{
      preserveAspectRatio:"xMidYMid slice"
    },
  };

 const fetchMessages=async()=>{
  if(!selectedChat)return;
  try {
    const config={
          headers:{
            Authorization:`Bearer ${user.token}`,

          },
        };
        setLoading(true);
        const {data}=await axios.get(`/api/message/${selectedChat._id}`,
        config
        );

       // console.log(selectedChat)
        setMessages(data)
        setLoading(false);
        socket.emit("join chat",selectedChat._id);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: "Failed to load the messages",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });  
  }
 };


  useEffect(() => {
    socket = io(ENDPOINT, { secure: true });
    socket.emit("setup", user);
    socket.on("connected", () => setsocketConnected(true));
    socket.on('typing',()=>setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
 
 
  }, []);

 useEffect(()=>{
  fetchMessages();


selectedChatCompare=selectedChat;
 },[selectedChat]);

 //console.log(notification,"----------------------")

 useEffect(() => {
   socket.on("message recieved",(newMessageRecieved)=>{
    if(!selectedChatCompare||selectedChatCompare._id!==newMessageRecieved.chat._id){
     //give notification
     if(!notification.includes(newMessageRecieved)){
      setNotification([newMessageRecieved,...notification])
      setFetchAgain(!fetchAgain);
     }

    } else{
      setMessages([...messages,newMessageRecieved]);
    }
   });
 });




  const sendMessage=async(event)=>{
    if(event.key==="Enter" && newMessage)
    {
      socket.emit("stop typing",selectedChat._id)
      try {
        const config={
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${user.token}`,

          },
        };
        const {data}=await axios.post('/api/message',{
          content:newMessage,
          chatId:selectedChat._id,
        },config
        );
        // console.log(data);

        socket.emit("new messages",data);
        setNewMessage("")
        setMessages([...messages,data]);
        
      } catch (error) {
        // console.log(error)
        toast({
          title: "Error Occured!",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        
      }

    }
  };








  const typingHandler = (e) => {
  setNewMessage(e.target.value);

  //typing indicator logic
  if(!socketConnected)return;
  if(!typing){
    setTyping(true)
    socket.emit("typing",selectedChat._id)
  }
  let lastTypingTime=new Date().getTime();
  var timerLength=3000;
  setTimeout(()=>{
    var timeNow=new Date().getTime();
    var timeDiff=timeNow-lastTypingTime;

    if(timeDiff>=timerLength&& typing)
    {
      // console.log("typing stop")
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }
  }, timerLength);


  };


  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                
                  {/* <ProfileModal
                    user={getSender(user, selectedChat.users)}
                  ></ProfileModal> */}

                {<ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                ></ProfileModal> }
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                ></UpdateGroupChatModal>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
        {loading?(<Spinner
            size="xl"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
        />
      ):(
        <div className='messages'
        
        >
          <ScrollableChat messages={messages}/>
        </div>
      )
      }
      <FormControl onKeyDown={sendMessage} isRequired mt={3}>
        {isTyping?<div><Lottie
         options={defaultOptions}
         width={70}
         style={{marginBottom: 15,marginLeft: 0}}

        /></div>:<></>}
        <Input
         variant="filled"
         bg="#E0E0E0"
         placeholder='Enter a message..'
         onChange={typingHandler}
         value={newMessage}
        />
      </FormControl>
          </Box>
        </>

      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat
