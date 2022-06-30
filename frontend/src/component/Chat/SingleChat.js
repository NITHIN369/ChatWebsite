import ChatContext from "../../context/ChatContext";
import { useContext, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import "./styles.css"
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000"; 
var socket, selectedChatCompare;
function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected,setSocketConnected]=useState(false)
  const toast=useToast()
  const { selectedChat, setSelectedChat, user } = useContext(ChatContext);
  function getSender(reguser, users) {
    return reguser._id == users[0]._id ? users[1] : users[0];
  }
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
  }, []);
  async function sendMessage(e) {
    if (e.key == "Enter" && newMessage) {
      try {
        const { data } = await axios.post("/api/message", {
          content: newMessage,
          chatId: selectedChat._id,
        });
        socket.emit("new message",data)
        setNewMessage("");

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }
  function typingHandler(e) {
    setNewMessage(e.target.value);
  }
  async function fetchMessages(){
     if (!selectedChat) return;
     try{
      setLoading(true)
        const {data}=await axios.get(`/api/message/${selectedChat._id}`)
        setMessages(data)
        setLoading(false)
        socket.emit("join chat",selectedChat._id)
     }catch(error){
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
     }
  }
  useEffect(()=>{
    socket.on("message recieved", (newMessageRecieved)=>{
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //need to send notification
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  })
  useEffect(()=>{
    fetchMessages()
    selectedChatCompare=selectedChat
  },[selectedChat])
  
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
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
                {getSender(user, selectedChat.users).name}
                <ProfileModal user={getSender(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
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
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
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
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}
export default SingleChat;
