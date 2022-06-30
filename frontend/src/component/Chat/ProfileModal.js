import { ViewIcon } from "@chakra-ui/icons";
import {Image ,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Avatar,Text  
} from "@chakra-ui/react";
function ProfileModal({user,children}) {
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        {children ? (
          <span onClick={onOpen}>{children}</span>
        ) : (
          <IconButton
            display={{ base: "flex" }}
            icon={<ViewIcon />}
            onClick={onOpen}
          />
        )}
        <Modal size="lg" isCentered isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent h="410px">
            <ModalHeader
              fontSize={"30px"}
              display="flex"
              justifyContent={"center"}
            >
              {user.name}
            </ModalHeader>
            {/* <ModalCloseButton />    */}
            <ModalBody
              display="flex"
              flexDir="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
              />
              <Text fontSize={{ base: "28px", md: "30px" }}>
                Email: {user.email}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme={"blue"} mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
}
export default ProfileModal;
