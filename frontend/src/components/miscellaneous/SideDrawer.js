import { Box } from "@chakra-ui/layout";
import { Tooltip,Menu, MenuButton, MenuList, Avatar ,MenuItem, MenuDivider, Drawer,DrawerOverlay ,DrawerCloseButton,DrawerContent,DrawerHeader, Input,DrawerBody, Toast, useToast} from '@chakra-ui/react';
import React,{useState} from 'react';
import { Button } from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons";
// import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import { getSender } from "../../config/ChatLogics";
import Effect from "react-notification-badge";
import NotificationBadge from "react-notification-badge";
const SideDrawer = () => {
  const[search,setSearch]=useState("");
  const[searchResult,setSearchResult]=useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat,setLoadingChat]=useState();

  const { user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();
      
   const history=useHistory()
  const { isOpen, onOpen, onClose } = useDisclosure()

    const logoutHandler=()=>{
      localStorage.removeItem("userInfo");
      history.push("/")
    }
     
    const toast=useToast();

    const handleSearch=async()=>{
     if(!search){
      toast({
        title:"Please enter something",
        status:"warning",
        duration:5000,
        isClosable:"true",
        position:"top-left"
      });
      return;
     }
     try{
      setLoading(true)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        },
      };
      // console.log(search)
      // console.log(config)
      const {data}= await axios.get(`/api/user?search=${search}`,config)

      // console.log(data)
      setLoading(false);
      setSearchResult(data);
     } catch(error){
      // console.log(error)
      toast({
        title: "Error Occured!",
        description:"Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

     }
    };

    const accessChat = async(userId) => {
      try {
        setLoadingChat(true);

      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`
      } ,
    };
     const{data}=await axios.post('/api/chat',{userId},config) ;
     if(!chats.find((c)=>c._id===data._id)) setChats([data, ...chats]);
     setSelectedChat(data);
     setLoadingChat(false);
     onClose();

  }catch (error) {
    toast({
      title: "Error fetching the chat",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
        
      }
    };
   
  // console.log(searchResult)
  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          width: "100%",
          padding: "5px 10px 5px 10px",
          borderWidth: "5px",
        }}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button varient="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
              
              />
              <BellIcon></BellIcon>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem key={notif._id}
                 onClick={()=>{
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n)=>n!==notif));
                 }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user,notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}> My Profile</ProfileModal>

              {/* <MenuItem>My Profile</MenuItem> */}
              <MenuDivider />
              <MenuItem onClick={logoutHandler}> Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px"> Search Users</DrawerHeader>

          <DrawerBody>
            <Box style={{ display: "flex" }} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {
              loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )
              // <span>results</span>
            }
            {loadingChat && <Spinner ml="auto" style={{ display: "flex" }} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer
