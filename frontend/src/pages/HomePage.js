import {
  Container,
  Box,
  Text,
  Center,
  Tabs,
  Tab,
  TabList,
  TabPanel
,TabPanels} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../component/Authentication/Login"
import SignUp from "../component/Authentication/SignUp";
import ChatContext from "../context/ChatContext";
function HomePage(){
  const navigate=useNavigate()  
  const { setUser } = useContext(ChatContext);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));    
    if (userInfo) {          
    setUser(userInfo.user);
    navigate("/chat");
    }
  }, []);
    return (
      <Container maxW="xl" centerContent>
        <Box
          d="flex"
          justifyContent="center"
          p={3}
          bg={"white"}
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text>
            <Center> Chat WebSite</Center>
          </Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        {/* <Center> */}
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login/>
              </TabPanel>
              <TabPanel>
                <SignUp/>
              </TabPanel>
            </TabPanels>
          </Tabs>
          {/* </Center> */}
        </Box>
      </Container>
    );
}
export default HomePage