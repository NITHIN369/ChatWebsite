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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  function handleClick() {
    setShow(show ? false : true);
  }
  async function submitHandler() {
    setLoading(true);
    if (!mail || !password) {
      toast({
        title: "Please enter all fields having *",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      setLoading(false);
      return;
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/user/login/",
          {
            email: mail,
            password,
          },
          config
        );
        toast({
          title: "Successfully Log In",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/chat");
        setLoading(false);
      } catch (err) {
        toast({
          title: "Error Occured Please Check Your Credintials",
          description: err.response.data.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setLoading(false);
      }
    }
  }

  return (
    <VStack spacing="5px">
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
      <Button
        width="30%"
        colorScheme="blue"
        onClick={submitHandler}
        style={{ marginTop: 15 }}
      >
        Login
      </Button>
    </VStack>
  );
}
export default Login;
