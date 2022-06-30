import {
  Box,
  Button,
  Text,
  Tooltip,
  Flex,
  useDisclosure,
  Input,
  Spinner,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/toast";
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import ChatContext from "../../context/ChatContext";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading"
import UserListItem from "./UserListItem"
function SideDrawer() {
  const toast = useToast();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat, chats, setChats } =
    useContext(ChatContext);
  const navigate = useNavigate();
  async function handleSearch() {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`api/user?search=${search}`);
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  function logoutHandler() {
    localStorage.removeItem("user");
    navigate("/");
  }
  async function accessChat(userId){
    try{
      setLoadingChat(true)
        const config={
          headers:{
            "Content-type":"application/json"
          }
        }
        const {data}=await axios.post("/api/chat",{userId},config)
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data)
        setLoadingChat(false)
        onClose()
    }catch(error){
toast({
  title: "Error fetching the chat",
  description: error.message,
  status: "error",
  duration: 5000,
  isClosable: true,
  position: "bottom-left",
});
    }
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip hasArrow placement="bottom-end" label="Search Users to Chat">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              {/* px is horizontal padding */}
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl">Chat WebSite</Text>
        <div>
          {/* <Menu>
            <MenuButton p="1" fontSize="2xl">
              <BellIcon />
            </MenuButton>
          </Menu> */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={"sm"} name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>

              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" marginBottom="3">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((searchedUser) => (
                <UserListItem
                  key={searchedUser._id}
                  user={searchedUser}
                  handleFunction={() => accessChat(searchedUser._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default SideDrawer;
