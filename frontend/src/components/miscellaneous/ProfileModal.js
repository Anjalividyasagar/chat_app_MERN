import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks';
import { IconButton, Menu, MenuItem } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { Modal } from '@chakra-ui/react';
import { ModalOverlay } from '@chakra-ui/react';
import { ModalContent } from '@chakra-ui/react';
import { ModalHeader } from '@chakra-ui/react';
import { ModalCloseButton } from '@chakra-ui/react';
import { ModalBody } from '@chakra-ui/react';
import { ModalFooter } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Image,Text } from '@chakra-ui/react';
import { MenuButton } from '@chakra-ui/react';
// import User from '../../../../backend/models/userModel';

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // console.log(user)
  return (
    <>
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="370px">
          <ModalHeader
            style={{
              fontFamily: "40px",
              fontFamily: "Work sans",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email:{user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {children ? (
        <Menu>
          <MenuItem onClick={onOpen}> {children}</MenuItem>
        </Menu>
      ) : (
        // <span onClick={onOpen}> {children} </span>
        <Menu>
          <MenuButton
            as={IconButton}
            display={{ base: "flex" }}
            icon={<ViewIcon />}
            onClick={onOpen}
          />

          {/* <MenuItem>
          <IconButton
            display={{ base: "flex" }}
            icon={<ViewIcon />}
            onClick={onOpen}
          />
        </MenuItem> */}
        </Menu>

        // <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
    </>
    // {children  ? "hello":"world"});
    //   <MenuItem>{children}</MenuItem>;
    //    {children ? (
    //     <span onClick={onOpen}> {children} </span>
    //    ):(
    //     <IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
    //    )}
  );
};

export default ProfileModal
