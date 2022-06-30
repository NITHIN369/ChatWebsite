import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios"
import { Navigate, useNavigate } from "react-router-dom";
function SignUp() {
  const navigate=useNavigate()
  const toast=useToast()
  const [loading,setLoading]=useState(false)
  const [confirmPassword,setConfirmPassword]=useState("")
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [confirmshow,setCOnfirmShow]=useState(false)
  const [pic,setPic]=useState("")
  function handleClickConfirm(){
    setCOnfirmShow(confirmshow?false:true)
  }
  function handleClick() {
    setShow(show ? false : true);
  }
  function postDetails(pics){
    setLoading(true)
      console.log("Inside post details")
      if(pics==undefined){
        toast({
          title: "Please upload a Picture",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        setLoading(false)
        return
      }
      if(pics.type=="image/jpeg" || pics.type=="image/png" ){
        const cloudData=new FormData()
        cloudData.append("file",pics);
        cloudData.append("upload_preset", "chat-app");
        cloudData.append("cloud_name", 'nithinmern');
        fetch("https://api.cloudinary.com/v1_1/nithinmern/image/upload",{
          method:"post",
          body:cloudData
        }).then((res)=>res.json())
        .then(data=>{setPic(data.url.toString());
        setLoading(false)})
        .catch(err=>{console.log(err);
        setLoading(false)})
      }else{
        toast({
          title: "Please upload a Picture of type .jpeg or .png",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
  }
  async function submitHandler(){
    if(password!=confirmPassword){
      toast({
        title: "Invalid Password",
        description: "Password and Confirm Password should match",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return
    }
    if(!name || !mail || !password){
      toast({
        title: "Please enter all fields having *",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }else{
      const config={
        headers:{
          "Content-type":"application/json"
        }
      }
      const {data}=await axios.post("/api/user/",{
        name,email:mail,password,pic
      },config)
      toast({
        title: "Successfully Registered",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      localStorage.setItem("user",JSON.stringify(data))
      navigate("/chat")
    }
  }
  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Mail</FormLabel>
        <Input
          type={"email"}
          placeholder="Enter Your Mail"
          onChange={(e) => {
            setMail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Passowrd</FormLabel>
        <InputGroup>
          <Input
            type={confirmshow ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClickConfirm}>
              {confirmshow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          p={1}
          type={"file"}
          accept={"image/*"}
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        width="30%"
        colorScheme="blue"
        onClick={submitHandler}
        style={{ marginTop: 15 }}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}
export default SignUp;
