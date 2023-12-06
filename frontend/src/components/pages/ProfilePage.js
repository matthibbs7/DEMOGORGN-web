import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react'
import ProfileCard from '../Cards/ProfileCard';

const ProfilePage = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
            setUsername(data.username)
            setEmail(data.email)
            console.log("You are logged in as: " + data.username + data.email);
        })
        .catch((err) => {
            console.log(err);
        });
    }


    return (
        <>
            <Flex justifyContent='center' flexDirection="column">
                <Flex ml="auto" mr="auto" width="100%" maxWidth="1050px" bgColor="#F1F4F8" mb={5} height="auto">
                    <Flex justifyContent='center' mt={5} flexDirection='column' width="100%">
                        <ProfileCard email={email} username={username} isAuthenticated={isAuthenticated} />
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
export default ProfilePage;