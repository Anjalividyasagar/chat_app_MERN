import React, { useState } from 'react'
import axios from 'axios'
import {useEffect} from 'react'
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';
import { Box, Flex } from "@chakra-ui/layout";
const ChatPage=() => {
 
  const { user}=ChatState();
  const [fetchAgain,setFetchAgain]=useState(false);


 return (
  <div style={{width:"100%"}}>
    { user && <SideDrawer/>}
    <Box
     style={{justifyContent:'space-between',display:"flex",width:"100%",height:"91.5vh",padding:"10px"}}
    >
    { user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>)}
    </Box>
    </div>
 )
    
};


export default ChatPage
