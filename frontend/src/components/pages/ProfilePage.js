import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react'
import ProfileCard from '../Cards/ProfileCard';

const ProfilePage = ({
    isAuthenticated,
    username,
    email,
    logout,
}) => {
    return (
        <>
            <Flex justifyContent='center' flexDirection="column">
                <Flex ml="auto" mr="auto" width="100%" maxWidth="1050px" bgColor="#F1F4F8" mb={5} height="auto">
                    <Flex justifyContent='center' mt={5} flexDirection='column' width="100%">
                        <ProfileCard email={email} username={username} isAuthenticated={isAuthenticated} logout={logout} />
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
export default ProfilePage;