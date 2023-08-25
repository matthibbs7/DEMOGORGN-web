import React from 'react';
import { render } from 'react-dom';
import Home from './Home';
import { theme } from '../chakra/theme';
import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'
import { Toaster } from 'react-hot-toast';


// Entry point of React application
const App = (props) => {
    return (
        <RecoilRoot>
            <Toaster/>
            <ChakraProvider theme={theme}>
                <Home />
            </ChakraProvider>
        </RecoilRoot>
    )
}

export default App;

const appDiv = document.getElementById("app");
render(<App />, appDiv);
