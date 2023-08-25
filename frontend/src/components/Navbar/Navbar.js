import React, { useState } from 'react';
import { Flex, Image, Text, Link } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { authStateAtom } from '../../atoms/authAtom';
const Navbar = () => {
    
    

    return (
        <Flex bg='#161616' justifyContent='center'>
            <Flex bg="#161616" height="76px" padding="6px 12px" align="center" width="100%" maxWidth='1000px' minWidth="436px">
                <Flex align="center" mr={5}>
                    
                    <Link href='/' style={{ textDecoration: 'none' }}>
                        <Text  color="white" fontWeight={500} fontSize="18pt" display={{base: "none", md: 'unset'}}>DEMOGORGN GREENLAND</Text>
                    </Link>
                    
                </Flex>
                {/* <Directory /> */}
            </Flex>
            {/* {authState.authenticated && <Text color="white" fontSize="14pt">LOGGED IN</Text>} */}
            <Link href="https://www.gatorglaciology.com/">
                <Image  src="https://i.imgur.com/3egc4Cx.png" height="54px" minWidth="54px" maxWidth='54px' mt={3} mr={5} />
            </Link>
        </Flex>
    
    )
}
export default Navbar;