import React, { useEffect, useState } from 'react';
import { Button, Flex, Text, Link, Menu, MenuButton, MenuList, Box, MenuItem } from '@chakra-ui/react';
import { IoPersonOutline } from 'react-icons/io5'
import toast from 'react-hot-toast';
import "@fontsource/ibm-plex-sans";

const SelectorBar = () => {
    const [active, setActive] = useState('/')
    const [username, setUsername] = useState('')
    // const router = useRouter()

    // useEffect(() => {
    //     setActive(router.pathname)
    // }, [router.pathname]);

    const whoami = () => {
        fetch("/api/whoami/", {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
        })
        .then((res) => res.json())
        .then((data) => {
            setUsername(data.username)
            console.log("You are logged in as: " + data.username + data.email);
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
            credentials: "same-origin",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("session data:", data);
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
            credentials: "same-origin",
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
            credentials: "same-origin",
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
                <Link verticalAlign="center" textAlign="center" fontSize="11pt" style={{borderLeft: '5px solid', borderColor: window.location.pathname === '/' ? '#0361FF' : 'transparent'}} ml={5} height="30px" borderRadius="0px" bg="#161616" color="white" fontWeight={400} _hover={{backgroundColor: '#222222', textDecoration: 'none'}} _active={{bg: '#222222'}} textDecoration="none" href="/" p={1} px={4}>What is DEMOGORGN?</Link>
                <Link verticalAlign="center" textAlign="center" fontSize="11pt" style={{borderLeft: '5px solid', borderColor: window.location.pathname === '/simulate' ? '#0361FF' : 'transparent'}} height="30px" borderRadius="0px" bg="#161616" color="white" fontWeight={400} _hover={{backgroundColor: '#222222', textDecoration: 'none'}} _active={{bg: '#222222'}} textDecoration="none" href="/simulate" p={1} px={4}>Generate Realizations</Link>
                <Link verticalAlign="center" textAlign="center" fontSize="11pt" style={{borderLeft: '5px solid', borderColor: window.location.pathname === '/methodology' ? '#0361FF' : 'transparent'}} height="30px" borderRadius="0px" bg="#161616" color="white" fontWeight={400} _hover={{backgroundColor: '#222222', textDecoration: 'none'}} _active={{bg: '#222222'}} textDecoration="none" href="/methodology" p={1} px={4}>Methodology</Link>

                <Button fontSize="11pt" ml="auto" height="30px" borderRadius="0px" bg="#161616" fontWeight={400} _hover={{backgroundColor: '#222222'}} color="white">Feedback</Button>
                <Button fontSize="11pt" style={{borderLeft: active === '/about' ? '5px solid' : '5px', borderColor: active === '/about' ? '#0361FF' : '#161616'}} onClick={() => Router.push('/about')} bg="#161616" color='white' height="30px" fontWeight={400} _hover={{backgroundColor: '#222222'}} borderRadius="0px">About</Button>
                <Menu>
                        <MenuButton pl="14px" pr="14px" _hover={{backgroundColor: '#222222'}} mr={10} color="white">
                            {isAuthenticated ? username : 
                                <IoPersonOutline />
                            }
                        </MenuButton>
                        {isAuthenticated ? 
                            <MenuList zIndex={1000} pt={0} pb={0} minW="0" w="160px" border="2px solid lightgrey" bg="white" borderRadius="0px">
                                    <MenuItem onClick={event =>  window.location.href='/profile'} pl="20px" _focus={{}} _hover={{bg: "#0E61FE", color: 'white', cursor: 'pointer'}} color="black">Profile</MenuItem>
                                    <MenuItem onClick={()=>logout()} pl="20px" _hover={{bg: "#0E61FE", color: 'white', cursor: 'pointer'}} color="black">Logout</MenuItem>
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