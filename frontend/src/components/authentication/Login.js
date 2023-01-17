import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Button } from "@chakra-ui/button";
import { Input, InputRightElement, InputGroup } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";


const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setpassword] = useState();
  const [loading,setLoading]=useState(false);
  const toast=useToast();
  const history=useHistory();
 
  
  const handleClick = () => setShow(!show);

 // const postDetails = (pics) => {};
  const submitHandler = async() => {
    setLoading(true);
      if(!email||!password){
         toast({
           title: "Please Fill all the Feilds",
           status: "warning",
           duration: 5000,
           isClosable: true,
           position: "bottom",
         });
         setLoading(false);
         return;
      }
       try{
        const config={
          headers:{
            "Content-type":"application/json",
          },
        };
        // console.log(email,password);
        const{data}=await axios.post("/api/user/login",{email,password},config);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo",JSON.stringify(data));

        setLoading(false);
       // history.push('/chats')
       history.push("/chats")
       }catch(error){
        // console.log(error)
        toast({
          title: "Error Occured!",
          description:error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        
         setLoading(false);
       }

  };

  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>EMAIL</FormLabel>
        <Input
          placeholder="Enter Your EMAIL"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        {" "}
        Login
      </Button>
      <Button
       variant="solid"
       colorScheme="red"
       width="100%"
       onClick={()=>{
        setEmail("guest@example.com");
        setpassword("123456");
       }}
      >  Get Guest User Credentials</Button>
    </VStack>
  );
};

export default Login;
