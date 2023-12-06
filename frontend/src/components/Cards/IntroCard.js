import { Flex, Text, Link, Image } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const IntroCard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [csrf, setCsrf] = useState("");
    
    const getCSRF = () => {
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

    
    useEffect(() => {
        getSession();
    }, [])

    const getSession = () => {
        fetch("/api/session/", {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
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

    return (
        <>  
            <Flex pb={3} bgColor="white" flexDirection={['column', 'column', 'row', 'row']} flexWrap='wrap' border="1px solid black">
                <Flex width={["100%", "100%", "50%", "50%"]} flexDirection="column" p="30px">
                    <Text fontWeight={600} fontSize="18pt">What is DEMOGORGN GREENLAND?</Text>

                    <Text fontSize="11pt" mt={5} pt={3}>Digital Elevation Model Of Geostatistical ORiGiN or <i>DEMOGORGN</i> for short is a website that allows researchers that lack computing researchers to generate various realizations of Greenland topography.

                        Why do we use it?
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here
                    </Text>
                    <Link href="/simulate" mt={5}>
                        <Text fontWeight={600} color="#0E61FE">Generate Realizations →</Text>
                    </Link>
                    <Link href="/about" mt={2}>
                        <Text fontWeight={600} color="#0E61FE">Learn about the Gator Glaciology Lab →</Text>
                    </Link>
                </Flex>
                <Flex width={["100%", "100%", "50%", "50%"]} bgColor="white" padding="30px" align="center">
                    <Image src="https://i.imgur.com/d71xGIY.jpg" height="400px" />
                </Flex>
            </Flex>

        </>
    )
}
export default IntroCard;