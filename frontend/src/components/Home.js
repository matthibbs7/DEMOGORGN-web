import React from 'react';
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

const Home = (props) => {
    return (
        <>
            <Navbar />
            <Box w='100%' display={{base: "none", md: "unset"}}>
                <SelectorBar />
            </Box>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<MainPage />}></Route>
                    <Route path='/simulate' element={<SimulationPage />}/>
                    <Route path='/methodology' element={<MethodologyPage />}/>
                    <Route path='/about' element={<AboutPage />}/>
                    <Route path='/profile' element={<ProfilePage />}/>
                    <Route path='/auth' element={<AuthPage />}/>
                    <Route path='/auth2' element={<AuthPage2 />}/>
                    
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Home;