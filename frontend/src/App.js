import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { BrowserRouter, Routes, Route ,useNavigate} from "react-router-dom";
import { ChakraProvider, useToast } from "@chakra-ui/react";
import ChatContext from "./context/ChatContext";
function App() {  
  const [user, setUser] = useState();
  const [selectedChat,setSelectedChat]=useState()
  const [chats,setChats]=useState([])
  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<HomePage />}></Route>
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </ChatContext.Provider>
  );
}

export default App;
