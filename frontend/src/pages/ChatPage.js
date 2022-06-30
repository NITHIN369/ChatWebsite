import { Button ,Box} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MyChats from "../component/Chat/MyChats";
import SideDrawer from "../component/Chat/SideDrawer";
import ChatBox from "../component/Chat/ChatBox"
import ChatContext from "../context/ChatContext";
function ChatPage() {
  const navigate = useNavigate();
  const { user } = useContext(ChatContext);  
  const [fetchAgain, setFetchAgain] = useState(false);
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display={"flex"}>
        {user && (
          <MyChats fetchAgain={fetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}
export default ChatPage;
