import React from "react"
import { 
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Heading,
    Button,
    Text,
    Flex,
    CloseButton,
    Link
} from "@chakra-ui/react"

const NavDrawer = ({
    isOpen,
    onClose
}) => {
    
    return (
        <Drawer onClose={onClose} isOpen={isOpen} size="sm">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderBottomWidth="3px">
                    <Flex alignItems="center">
                        <Heading>DEMOGORGN</Heading>
                        <CloseButton _focus={{border: 'none', boxShadow: 'none'}} shadow="none" boxShadow="none" ml="auto" onClick={onClose} size='md' />
                    </Flex>
                </DrawerHeader>
                <DrawerBody>
                    <Flex mt={5} flexDirection="column" mb="auto">
                        <Text fontSize="16pt" fontWeight={600}>Account</Text>
                        <Flex onClick={() => window.location.href='/auth2'} mt={2} _hover={{background: "#f5f5f5", cursor: "pointer"}} py={2} px={3} borderRadius={5}>
                            <Text fontSize="14pt">Log In</Text>
                        </Flex>
                        <Flex _hover={{background: "#f5f5f5", cursor: "pointer"}} py={2} px={3} borderRadius={5}>
                            <Text fontSize="14pt">Sign Up</Text>
                        </Flex>
                        <Text mt={10} fontSize="16pt" fontWeight={600}>Content</Text>
                        <Flex onClick={() => window.location.href='/'} mt={2} _hover={{background: "#f5f5f5", cursor: "pointer"}} py={2} px={3} borderRadius={5}>
                            <Text fontSize="14pt">Home</Text>
                        </Flex>
                        <Flex onClick={() => window.location.href='/simulate'} _hover={{background: "#f5f5f5", cursor: "pointer"}} py={2} px={3} borderRadius={5}>
                            <Text fontSize="14pt">Simulate</Text>
                        </Flex>
                        <Flex onClick={() => window.location.href='/methodology'} _hover={{background: "#f5f5f5", cursor: "pointer"}} py={2} px={3} borderRadius={5}>
                            <Text fontSize="14pt">Methodology</Text>
                        </Flex>
                    </Flex>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default NavDrawer;