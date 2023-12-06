import React from "react";
import { Flex, Image, Text, Link } from "@chakra-ui/react";
import { HiOutlineMenu } from "react-icons/hi";
import { useDisclosure } from "@chakra-ui/react";
import NavDrawer from "./Drawer";

const Navbar = ({
    isAuthenticated,
    logout,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Flex borderBottom={["1px solid lightgray", "1px solid lightgray", "none", "none"]} bg="#161616" justifyContent="center">
                <Flex
                    bg="#161616"
                    height="76px"
                    padding={["6px 8px", "6px 8px", "6px 12px", "6px 12px"]}
                    align="center"
                    width="100%"
                    maxWidth="1000px"
                    >
                    <Flex align="center" mr={5}>
                        <Link href="/" style={{ textDecoration: "none" }}>
                            <Text color="white" fontWeight={500} fontSize="18pt">
                                DEMOGORGN GREENLAND
                            </Text>
                        </Link>
                    </Flex>
                </Flex>
                {/* {authState.authenticated && <Text color="white" fontSize="14pt">LOGGED IN</Text>} */}
                <Link display={["none", "none", "unset", "unset"]} href="https://www.gatorglaciology.com/">
                    <Image
                        src="https://i.imgur.com/3egc4Cx.png"
                        height="54px"
                        minWidth="54px"
                        maxWidth="54px"
                        mt={3}
                        mr={5} 
                    />
                </Link>
                <Flex onClick={onOpen} display={["flex", "flex", "none", "none"]} _hover={{cursor: 'pointer'}} mr={2} justifyContent="center" align="center">
                    <HiOutlineMenu fontSize='20pt' color="white" />
                </Flex>
            </Flex>
            <NavDrawer isAuthenticated={isAuthenticated} logout={logout} onClose={onClose} isOpen={isOpen} />
        </>
    );
};
export default Navbar;
