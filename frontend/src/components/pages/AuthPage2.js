import React, { useEffect, useState } from "react";
import { authStateAtom } from '../../atoms/authAtom';
import { useRecoilState } from 'recoil';
import { Flex, Input, Text, Button, Box } from "@chakra-ui/react";
import toast from 'react-hot-toast';
import "@fontsource/ibm-plex-sans";

const AuthPage2 = (props) => {
    const [csrf, setCsrf] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [renderAuth, setRenderAuth] = useState("login");

    const [loading, setLoading] = useState(false);



    const [signUpForm, setSignUpForm] = useState({
        username: '',
        password: '',
        email: '',
    })

    const [loginForm, setLoginForm] = useState({
        username: '',
        password: '',
    });

    
    const onChange = (event) => {
        setLoginForm((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
    };

    const onChangeSignUp = (event) => {
        setSignUpForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
          }));
    }

    useEffect(() => {
        getSession();
    }, [])

    const getCSRFOLD = () => { //TODO REMOVE
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

    //
    const getCSRFTokenFromCookies = () => {
        let csrfToken = "";
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith("csrftoken=")) {
                csrfToken = cookie.substring("csrftoken=".length);
                break;
            }
        }
        return csrfToken;
    };
    
    const getCSRF = () => {
        fetch("/api/csrf/", {
            credentials: "include",
        })
        .then((res) => {
            let csrfToken = getCSRFTokenFromCookies();
            setCsrf(csrfToken);
            console.log(csrfToken);
        })
        .catch((err) => {
            console.log(err);
        });
    };
    //

    const getSession = () => {
        getCSRF();
        fetch("/api/session/", {
            credentials: "include",
            headers: {
                "X-CSRFToken": csrf,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("session data:", data);
            if (data.isAuthenticated) {
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

    const whoami = () => {
        fetch("/api/whoami/", {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("You are logged in as: " + data.username);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    const handleUserNameChange = (event) => {
        setUsername(event.target.value);
    }

    const isResponseOk = (response) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
    }

    const signup = (event) => {

        setLoading(true)
        event.preventDefault();


        
        fetch("/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({username: signUpForm.username, password: signUpForm.password, email: signUpForm.email}),
        })
        .then(isResponseOk)
        .then((data) => {
            console.log("signup response, ",data);
            // setIsAuthenticated(true);
            // setUsername("");
            // setPassword("");
            // setError("");
            setLoading(false);
            // window.location.href = "/";
        })
        .catch((err) => {
            console.log(err);
            setError("User with that Email or Username already exists");
            setLoading(false);
        });
        
        
    }

    const login = (event) => {
        setLoading(true)
        event.preventDefault();
        fetch("/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf,
            },
            credentials: "include",
            body: JSON.stringify({username: loginForm.username, password: loginForm.password}),
        })
        .then(isResponseOk)
        .then((data) => {
            console.log(data);
            setIsAuthenticated(true);
            toast.success('Successfully Logged In!', {
                style: {
                  border: '1px solid grey',
                  padding: '8px',
                  color: '#0E61FE',
                  fontWeight: 'bold',
                  fontFamily: `"IBM Plex Sans"`,
                },
                iconTheme: {
                  primary: '#edece8',
                  secondary: '#0E61FE',
                },
            });

            setUsername("");
            setPassword("");
            setError("");
            setLoading(false);
            window.location.href = "/";
        })
        .catch((err) => {
            console.log(err);
            setError("Invalid username or password.");
            setLoading(false);
        });
    }

    const logout = () => {
        fetch("/api/logout", {
            credentials: "include",
        })
        .then(isResponseOk)
        .then((data) => {
            console.log(data);
            // setAuthState(prev => ({
            //     ...prev,
            //     isAuthenticated: false,
            //     username: undefined,
            //     password: undefined,
            // }))
            setIsAuthenticated(false);
            getCSRF();
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <Flex height="100%" justifyContent='center' flexDirection="column">
                <Flex height="100%" flexDirection="column" ml="auto" mr="auto" width="100%" maxWidth="1050px" bgColor="#F1F4F8" mb={5}>
                    
                    {renderAuth == "login" && 
                        <Flex flexDir="column" border="1px solid #434343" width="502px" ml="auto" mr="auto" mt="7%">
                            <Flex borderBottom="1px solid black" p={5} bg="white" width="500px" height="340px" alignContent="center" ml="auto" mr="auto" flexDirection='column'>
                                <Text fontSize="22pt" mt={-1}>Log in</Text>
                                <form onSubmit={login}>
                                    <Flex mt={5} flexDir="row" justifyContent="center">
                                        <Text fontSize="11pt" color="gray.500">Username</Text>
                                        <Text textDecoration="underline" fontSize="10pt" color="#0E61FE" ml="auto"></Text>
                                    </Flex>
                                    <Flex flexDir="column">
                                        <Input _hover={{border: "2px solid #f4f4f4"}} fontWeight={700} autoFocus={true} onChange={onChange} name="username" required _active={{border: '2px solid', borderColor: '#0E61FE'}} _focus={{boxShadow: "none", borderTop: "2px solid #0E61FE", borderRight: "2px solid #0E61FE", borderLeft: "2px solid #0E61FE", bg: 'white', borderBottom: "2px solid transparent"}} bg="#f4f4f4" borderTop="2px solid transparent" borderLeft="2px solid transparent" borderRight="2px solid transparent" borderBottom='2px solid transparent' mt={1} borderRadius="0px" placeholder=""/>
                                        <Box zIndex={2} mt={-0.5} width="100%" bg="#0E61FE" height="2px"></Box>
                                    </Flex>
                                    <Flex mt={5} flexDir="row" justifyContent="center">
                                        <Text fontSize="11pt" color="gray.500">Password</Text>
                                        <Text textDecoration="underline" fontSize="10pt" color="#0E61FE" ml="auto">Forgot password?</Text>
                                    </Flex>
                                    <Flex flexDir="column">
                                        <Input  _hover={{border: "2px solid #f4f4f4"}} fontWeight={700}  onChange={onChange} name="password" required type="password" _active={{border: '2px solid', borderColor: '#0E61FE'}} _focus={{boxShadow: "none", borderTop: "2px solid #0E61FE", borderRight: "2px solid #0E61FE", borderLeft: "2px solid #0E61FE", bg: 'white', borderBottom: "2px solid transparent"}} bg="#f4f4f4" borderTop="2px solid transparent" mt={1} borderLeft="2px solid transparent" borderRight="2px solid transparent" borderBottom='2px solid transparent' borderRadius="0px" placeholder=""/>
                                        <Box zIndex={2} mt={-0.5} width="100%" bg="#0E61FE" height="2px"></Box>
                                    </Flex>
                                    {error && <Text fontSize="10pt" color="red" mb={-5}>{error}</Text>}
                                    <Button isLoading={loading} type="submit" fontSize="11pt" pl="15px" _hover={{backgroundColor: '#044dd4'}} bg="#0E61FE" color="white" borderRadius={0} fontWeight={300} mt={8} width="130px" height="48px">Continue&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→</Button>
                                </form>
                            </Flex>
                            <Flex p={5} bg="white" width="500px" height="55px" justifyContent="center" ml="auto" mr="auto" flexDirection='column'>
                                <Flex flexDirection="row"><Text fontSize="11pt">Don't have an account?&nbsp;</Text><Text color="#0E61FE" fontSize="11pt" textDecoration="underline" _hover={{cursor: 'pointer'}} onClick={() => {setRenderAuth('register'); setError("")}} >Create one</Text></Flex>
                            </Flex>
                        </Flex>
                    }
                    {renderAuth == 'register' &&
                        <Flex flexDir="column" border="1px solid #434343" width="502px" ml="auto" mr="auto" mt="7%">
                            <Flex borderBottom="1px solid black" p={5} bg="white" width="500px" height="425px" alignContent="center" ml="auto" mr="auto" flexDirection='column'>
                                <Text fontSize="22pt" mt={-1}>Sign Up</Text>
                                <form onSubmit={signup}>
                                    <Flex mt={5} flexDir="row" justifyContent="center">
                                        <Text fontSize="11pt" color="gray.500">Email</Text>
                                        <Text textDecoration="underline" fontSize="10pt" color="#0E61FE" ml="auto"></Text>
                                    </Flex>
                                    <Flex flexDir="column">
                                        <Input _hover={{border: "2px solid #f4f4f4"}} fontWeight={700} autoFocus={true} onChange={onChangeSignUp} name="email" type="email" required _active={{border: '2px solid', borderColor: '#0E61FE'}} _focus={{boxShadow: "none", borderTop: "2px solid #0E61FE", borderRight: "2px solid #0E61FE", borderLeft: "2px solid #0E61FE", bg: 'white', borderBottom: "2px solid transparent"}} bg="#f4f4f4" borderTop="2px solid transparent" borderLeft="2px solid transparent" borderRight="2px solid transparent" borderBottom='2px solid transparent' mt={1} borderRadius="0px" placeholder=""/>
                                        <Box zIndex={2} mt={-0.5} width="100%" bg="#0E61FE" height="2px"></Box>
                                    </Flex>
                                    <Flex mt={5} flexDir="row" justifyContent="center">
                                        <Text fontSize="11pt" color="gray.500">Username</Text>
                                        <Text textDecoration="underline" fontSize="10pt" color="#0E61FE" ml="auto"></Text>
                                    </Flex>
                                    <Flex flexDir="column">
                                        <Input  _hover={{border: "2px solid #f4f4f4"}} fontWeight={700}  onChange={onChangeSignUp} name="username" required _active={{border: '2px solid', borderColor: '#0E61FE'}} _focus={{boxShadow: "none", borderTop: "2px solid #0E61FE", borderRight: "2px solid #0E61FE", borderLeft: "2px solid #0E61FE", bg: 'white', borderBottom: "2px solid transparent"}} bg="#f4f4f4" borderTop="2px solid transparent" mt={1} borderLeft="2px solid transparent" borderRight="2px solid transparent" borderBottom='2px solid transparent' borderRadius="0px" placeholder=""/>
                                        <Box zIndex={2} mt={-0.5} width="100%" bg="#0E61FE" height="2px"></Box>
                                    </Flex>
                                    <Flex mt={5} flexDir="row" justifyContent="center">
                                        <Text fontSize="11pt" color="gray.500">Password</Text>
                                        <Text textDecoration="underline" fontSize="10pt" color="#0E61FE" ml="auto"></Text>
                                    </Flex>
                                    <Flex flexDir="column">
                                        <Input  _hover={{border: "2px solid #f4f4f4"}} fontWeight={700}  onChange={onChangeSignUp} name="password" required type="password" _active={{border: '2px solid', borderColor: '#0E61FE'}} _focus={{boxShadow: "none", borderTop: "2px solid #0E61FE", borderRight: "2px solid #0E61FE", borderLeft: "2px solid #0E61FE", bg: 'white', borderBottom: "2px solid transparent"}} bg="#f4f4f4" borderTop="2px solid transparent" mt={1} borderLeft="2px solid transparent" borderRight="2px solid transparent" borderBottom='2px solid transparent' borderRadius="0px" placeholder=""/>
                                        <Box zIndex={2} mt={-0.5} width="100%" bg="#0E61FE" height="2px"></Box>
                                    </Flex>
                                    {error && <Text fontSize="10pt" color="red" mb={-5}>{error}</Text>}
                                    <Button isLoading={loading} type="submit" fontSize="11pt" pl="15px" _hover={{backgroundColor: '#044dd4'}} bg="#0E61FE" color="white" borderRadius={0} fontWeight={300} mt={8} width="130px" height="48px">Continue&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→</Button>
                                </form>
                            </Flex>
                            <Flex p={5} bg="white" width="500px" height="55px" justifyContent="center" ml="auto" mr="auto" flexDirection='column'>
                                <Flex flexDirection="row"><Text fontSize="11pt">Already have an account?&nbsp;</Text><Text color="#0E61FE" fontSize="11pt" textDecoration="underline" _hover={{cursor: 'pointer'}} onClick={() => {setRenderAuth('login'); setError("")}} >Sign In</Text></Flex>
                            </Flex>
                        </Flex>

                    }
                    

                    
                </Flex>
        </Flex>
    )
}

  

export default AuthPage2;