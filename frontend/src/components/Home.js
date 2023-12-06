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

const Home = () => {
    const [csrf, setCsrf] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    useEffect(() => {
        getSession();
    }, [])

    return (
        <>
            <Navbar />
            <Box w='100%' display={{base: "none", md: "unset"}}>
                <SelectorBar />
            </Box>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<MainPage />}></Route>
                    <Route path='/simulate' element={<SimulationPage csrf={csrf} isAuthenticated={isAuthenticated} />}/>
                    <Route path='/methodology' element={<MethodologyPage />}/>
                    <Route path='/about' element={<AboutPage />}/>
                    <Route path='/profile' element={<ProfilePage />}/>
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