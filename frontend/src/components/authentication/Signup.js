import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Button } from "@chakra-ui/button";
import { Input, InputRightElement, InputGroup } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmPassword, setConfirmpassword] = useState();
  const [password, setpassword] = useState();
  const [pic, setPic] = useState();
  const[loading,setLoading]=useState(false)
  const toast=useToast();
const history=useHistory();
  const handleClick = () => setShow(!show);


  const postDetails = (pics) => {
     setLoading(true);
     console.log(pics)
    if(pics==undefined){
       toast({
         title: "Please Select an Image",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position:"bottom",
       });
       return;
    }
    if(pics.type==="image/jpeg" || pics.type==="image/png"){
      const data=new FormData();
      data.append("file",pics);
      data.append("upload_preset","CHAT-APP");
      data.append("cloud_name", "dgdkjvoxf");
      fetch("https://api.cloudinary.com/v1_1/dgdkjvoxf/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
         // console.log(data.url);
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
    else{
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

       setLoading(false);
      return;
    }
  };

  const submitHandler = async() => {
   // e.preventDefault();
      setLoading(true);
      console.log(name, email, password, confirmPassword);
      if(!name||!email||!password||!confirmPassword){
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
       if(password!==confirmPassword){
        toast({
          title: "Passwords do not match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
       }


       try{
        const config={
          headers:{
            "Content-type":"application/json",
          },
        };
        const {data}=await axios.post("/api/user",{name,email,password,pic},config);
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo",JSON.stringify(data));

        setLoading(false);
        history.push('/chats')
       }catch(error){
        console.log(error)
        toast({
          title: "Error Occured!",
          description:"Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        
       }

  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>EMAIL</FormLabel>
        <Input
          placeholder="Enter Your EMAIL"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
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

      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>upload your picture</FormLabel>
        <Input
          type={"file"}
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        
        Sign up
      </Button>
    </VStack>
  );
};

export default Signup;
