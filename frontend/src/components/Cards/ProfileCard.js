import { Flex, Text, Link, Image, Divider, Stack, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const ProfileCard = ({ email, username, isAuthenticated }) => {

    return (
        <>  
            <Flex flexDirection='row' width="100%" border="1px solid black" bg="white">
                <Flex flexDirection='column' p="30px">
                    <Stack>
                        <Text fontWeight={700} fontSize="18pt">Profile</Text>
                        
                        {isAuthenticated ? 
                            <Stack spacing={8} mt={5} pt={3} pl={3}>
                                <Flex>
                                    <Flex flexDir="column">
                                        <Text fontWeight={700} fontSize="15pt" mb={-1}>Username:</Text>
                                        <Text fontWeight={400} color="gray.600" fontSize="12pt" pt={-2}>{username}</Text>
                                    </Flex>
                                    <Flex flexDir="column" ml={5}>
                                        <Text fontWeight={700} fontSize="15pt" mb={-1}>Email:</Text>
                                        <Text fontWeight={400} color="gray.600" fontSize="12pt" pt={-2}>{email}</Text>
                                    </Flex>
                                    
                                </Flex> 
                                <Button fontSize="11pt" pl="15px" _hover={{backgroundColor: '#044dd4'}} bg="#0E61FE" color="white" borderRadius={0} fontWeight={300} mt={8} width="130px" height="48px">Logout&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→</Button>
                            </Stack>

                            :

                            <>
                                <Text>Not authenticated</Text>
                            </>
                    }
                        
                    </Stack>

                    
                
                </Flex>
            </Flex>

        </>
    )
}
export default ProfileCard;