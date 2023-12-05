import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useParams } from 'react-router';

import ViewRequestCard from '../Cards/ViewRequestCard';

const ViewRequestPage = (
    props,
    csrf,
) => {
    const { guid, rid } = useParams();
    return (
        <Flex justifyContent='center' >
            <Flex width="100%" maxWidth="1050px" bgColor="#F1F4F8" flexDirection="column">
                <Flex justifyContent='center' mt={[0,0,5,5]} flexDirection='column'>
                    <ViewRequestCard requestGUID={guid} rid={rid} csrf={csrf} />
                </Flex>
            </Flex>
        </Flex>
    )
}
export default ViewRequestPage;