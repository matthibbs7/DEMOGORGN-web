import React from 'react';
import { Flex, Text, Stack, Link } from '@chakra-ui/react'

const FeedbackPage = () => {
    return (
        <>
            <Flex justifyContent='center' flexDirection="column">
                <Flex ml="auto" mr="auto" width="100%" maxWidth="1050px" bgColor="#F1F4F8" mb={[0,0,5,5]}>
                    <Flex justifyContent='center' mt={[0,0,5,5]} flexDirection='column'>
                        <Flex flexDirection='row' flexWrap='wrap'>
                            <Flex border="1px solid black" bgColor="white" flexDirection='column' p="30px">
                                <Stack>
                                    <Text fontWeight={600} fontSize="18pt">Feedback</Text>
                                    <Text mb={5} fontSize="11pt" mt={5} pt={5}>Do you have feedback or suggestions? Specific things that we should account for? Feel free to contact us at <Link textDecoration="underline" color="blue.400" href="mailto:emackie@ufl.edu">emackie@ufl.edu</Link>. Our goal is to create tools that are useful and accessible, so we welcome your thoughts and insight. 
                                    </Text>
                                </Stack>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
export default FeedbackPage;