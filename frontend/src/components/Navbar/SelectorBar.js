import React, { useEffect, useState } from 'react';
import { Button, Divider, Flex, Text, Link, Menu, MenuButton, MenuList, Box, MenuItem } from '@chakra-ui/react';
import { IoPersonOutline } from 'react-icons/io5'
import toast from 'react-hot-toast';
import "@fontsource/ibm-plex-sans";

const SelectorBar = () => {
    const [active, setActive] = useState('/')
    const [username, setUsername] = useState('')

    const whoami = () => {
        fetch("/api/whoami/", {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            setUsername(data.username)
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [csrf, setCsrf] = useState("");

    useEffect(() => {
        getSession();
    }, [])

    const getSession = () => {
        fetch("/api/session/", {
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.isAuthenticated) {
                whoami();
                setIsAuthenticated(true);
                
            } else {
                setIsAuthenticated(false);
                getCSRF();
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const isResponseOk = (response) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
    }

    const logout = () => {
        fetch("/api/logout", {
            credentials: "include",
        })
        .then(isResponseOk)
        .then((data) => {
            console.log("logout", data);
            setIsAuthenticated(false);
            getCSRF();
            toast.success('Successfully Logged Out!', {
                style: {
                  border: '1px solid grey',
                  padding: '8px',
                  color: '#0E61FE',
                  fontWeight: 'bold',
                  fontFamily: `"IBM Plex Sans"`,
                },
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#0E61FE',
                },
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const getCSRF = () => {
        fetch("/api/csrf/", {
            credentials: "include",
        })
        .then((res) => {
            let csrfToken = res.headers.get("X-CSRFToken");
            setCsrf(csrfToken);
            console.log(csrfToken);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <Flex justifyContent='center' bg='#161616' borderTop="1px solid" borderColor='#434343'>
            <Flex height="30px" bg="#161616" width="100%" maxWidth="1100px">
                <Link wordBreak='break-all' verticalAlign="center" textAlign="center" fontSize="11pt" style={{borderLeft: '5px solid', borderColor: window.location.pathname === '/' ? '#0361FF' : 'transparent'}} ml={[0,0,0,5]} height="30px" borderRadius="0px" bg="#161616" color="white" fontWeight={400} _hover={{backgroundColor: '#222222', textDecoration: 'none'}} _active={{bg: '#222222'}} textDecoration="none" href="/" p={1} px={4}>What is DEMOGORGN?</Link>
                <Link verticalAlign="center" textAlign="center" fontSize="11pt" style={{borderLeft: '5px solid', borderColor: window.location.pathname === '/simulate' ? '#0361FF' : 'transparent'}} height="30px" borderRadius="0px" bg="#161616" color="white" fontWeight={400} _hover={{backgroundColor: '#222222', textDecoration: 'none'}} _active={{bg: '#222222'}} textDecoration="none" href="/simulate" p={1} px={4}>Generate Realizations</Link>
                <Link verticalAlign="center" textAlign="center" fontSize="11pt" style={{borderLeft: '5px solid', borderColor: window.location.pathname === '/methodology' ? '#0361FF' : 'transparent'}} height="30px" borderRadius="0px" bg="#161616" color="white" fontWeight={400} _hover={{backgroundColor: '#222222', textDecoration: 'none'}} _active={{bg: '#222222'}} textDecoration="none" href="/methodology" p={1} px={4}>Methodology</Link>

                <Button fontSize="11pt" ml="auto" height="30px" borderRadius="0px" bg="#161616" fontWeight={400} _hover={{backgroundColor: '#222222'}} color="white">Feedback</Button>
                <Link verticalAlign="center" textAlign="center" fontSize="11pt" style={{borderLeft: '5px solid', borderColor: window.location.pathname === '/about' ? '#0361FF' : 'transparent'}} height="30px" borderRadius="0px" bg="#161616" color="white" fontWeight={400} _hover={{backgroundColor: '#222222', textDecoration: 'none'}} _active={{bg: '#222222'}} textDecoration="none" href="/about" p={1} px={4}>About</Link>
                <Menu>
                        <MenuButton pl="14px" pr="14px" _hover={{backgroundColor: '#222222'}} mr={10} color="white">
                            {isAuthenticated ? username : 
                                <IoPersonOutline />
                            }
                        </MenuButton>
                        {isAuthenticated ? 
                            <MenuList zIndex={1000} pt={0} pb={0} minW="0" w="160px" border="2px solid lightgrey" bg="white" borderRadius="0px">
                                    <MenuItem onClick={() => window.location.href='/profile'} pl="20px" _focus={{}} _hover={{bg: "#0E61FE", color: 'white', cursor: 'pointer'}} color="black">Profile</MenuItem>
                                    <MenuItem onClick={() => window.location.href='/history'} pl="20px" _hover={{bg: "#0E61FE", color: 'white', cursor: 'pointer'}} color="black">History</MenuItem>
                                    <Divider />
                                    <MenuItem onClick={() => logout()} pl="20px" _hover={{bg: "#0E61FE", color: 'white', cursor: 'pointer'}} color="black">Logout</MenuItem>
                            </MenuList>
                        :
                            <MenuList zIndex={1000} pt={0} pb={0} minW="0" w="160px" border="2px solid lightgrey" bg="white" borderRadius="0px">
                                    <MenuItem onClick={event =>  window.location.href='/auth2'} pl="20px" _focus={{}} _hover={{bg: "#0E61FE", color: 'white'}} color="black"><Link _hover={{textDecoration: 'none'}} textDecoration="none" href="/auth2">Log in</Link></MenuItem>
                                    <MenuItem pl="20px" _focus={{}} _hover={{bg: "#0E61FE", color: 'white'}} color="black"><Link _hover={{textDecoration: 'none'}} textDecoration="none" href="/auth2">Sign up</Link></MenuItem>
                            </MenuList>
                        }
                </Menu>
            </Flex>
        </Flex>
    )
}
export default SelectorBar;