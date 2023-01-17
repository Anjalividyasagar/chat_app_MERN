import React from 'react'
import { Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'



const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box
    px={2}
    py={1}
    mx={2}
    borderRadius="lg"
    mb={2}
    varient="solid"
    fontSize={12}
    backgroundColor="purple"
    color='white'
      style={{displat:"flex"}}
    cursor="pointer"
    onClick={handleFunction}
    
    >
        {user.name}
        <CloseIcon pl={1}/>
      
    </Box>
  )
}

export default UserBadgeItem
