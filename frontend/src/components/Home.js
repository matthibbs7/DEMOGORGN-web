import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Redirect } from "react-router-dom";
import SimulationPage from './pages/SimulationPage';
import MainPage from './pages/MainPage';
import { Text, Box } from '@chakra-ui/react';
import Navbar from './Navbar/Navbar';
import SelectorBar from './Navbar/SelectorBar';
import AuthPage from './pages/AuthPage';
import AuthPage2 from './pages/AuthPage2';
import MethodologyPage from './pages/Methodology';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import ViewRequestPage from './pages/ViewRequestPage';
import FeedbackPage from './pages/FeedbackPage';
import toast from 'react-hot-toast';

const Home = () => {
    const [csrf, setCsrf] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

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
        })
        .catch((err) => {
            console.log(err);
        });
    };
    
    const isResponseOk = (response) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
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
            setUsername(data.username)
            setEmail(data.email)
        })
        .catch((err) => {
            console.log("whoami Error: ", err);
        });
    }

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
            if (data.isAuthenticated) {
                setIsAuthenticated(true);
                whoami();
            } else {
                setIsAuthenticated(false);
                getCSRF();
            }
        })
        .catch((err) => {
            console.log("getSession Error: ", err);
        });
    }

    const logout = () => {
        fetch("/api/logout/", {
            credentials: "include",
        })
        .then(isResponseOk)
        .then((data) => {
            setIsAuthenticated(false);
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
            getCSRF();
        })
        .catch((err) => {
            console.log("logout Error: ", err);
        });
    }

    useEffect(() => {
        getSession();
    }, [])

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} logout={logout}  />
            <Box w='100%' display={{base: "none", md: "unset"}}>
                <SelectorBar isAuthenticated={isAuthenticated} username={username} logout={logout} />
            </Box>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<MainPage />}></Route>
                    <Route path='/simulate' element={<SimulationPage csrf={csrf} isAuthenticated={isAuthenticated} />}/>
                    <Route path='/methodology' element={<MethodologyPage />}/>
                    <Route path='/about' element={<AboutPage />}/>
                    <Route path='/feedback' element={<FeedbackPage />}/>
                    <Route path='/profile' element={
                        <ProfilePage 
                            isAuthenticated={isAuthenticated} 
                            username={username} 
                            email={email}
                            logout={logout} 
                        />}
                    />
                    <Route path='/history' element={<HistoryPage csrf={csrf} isAuthenticated={isAuthenticated} />}/>
                    <Route exact path='/request/:guid' element={<ViewRequestPage csrf={csrf} />}/>
                    <Route exact path='/request/:guid/:rid' element={<ViewRequestPage csrf={csrf} />}/>
                    <Route path='/auth' element={<AuthPage />}/>
                    <Route path='/auth2' element={<AuthPage2 />}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Home;