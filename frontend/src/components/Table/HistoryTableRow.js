import React, { useState } from 'react';
import { Tr, Td, Flex, Text, Spinner } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaRegCopy, FaCopy  } from "react-icons/fa";
import { sleep } from '../../utils/utils';

const RequestsTableRow = ({
    simRequest,
    csrf,
}) => {

    const [isCopied, setIsCopied] = useState(false);

    const CopyGUID = async () => {
        navigator.clipboard.writeText(simRequest.guid);
        setIsCopied(true);
        await sleep(1600);
        setIsCopied(false);
    }

    return (
        <Tr h="48px">
            <Td borderBottomWidth="1.5px" fontWeight={700}><Flex gap={2}>{simRequest.guid} {isCopied ? <Flex><FaCopy color="#b8b8b8" /></Flex> : <Flex _hover={{cursor: 'pointer'}}><FaRegCopy color="#b8b8b8" onClick={() => CopyGUID()} /></Flex>}</Flex></Td>
            <Td borderBottomWidth="1.5px" fontWeight={700}>{simRequest.date.slice(0, -8)}</Td>
            <Td borderBottomWidth="1.5px">
                <Flex align="center">
                    {simRequest.realizations}
                    <Flex _hover={{cursor: 'pointer', opacity: '0.78'}} opacity={1} ml="auto" bg="#6394F0" color="whiteAlpha.900" px={1.5} py={1} borderRadius={5}>
                        <Link to={{ pathname: "/request/" + simRequest.guid }}>
                            <Text fontWeight={600}>View</Text>
                        </Link>
                    </Flex>
                </Flex>
            </Td>
        </Tr>
    );
}
export default RequestsTableRow;