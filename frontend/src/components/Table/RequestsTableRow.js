import React, { useState } from 'react';
import { Tr, Td, Flex, Text, Spinner } from "@chakra-ui/react";

import { cancelSingleRequestFromGUID } from '../../utils/utils';

const RequestsTableRow = ({
    simRequest,
    setTabIndex,
    getBatchRealizationStatus,
    csrf,
}) => {
    const [loading, setLoading] = useState(false);

    const cancelSingleRequest = async () => {
        if (simRequest.status === "PENDING" || simRequest.status === "RUNNING") {
            setLoading(true);
            const res = await cancelSingleRequestFromGUID(simRequest.guid, simRequest.rid, csrf);
            setLoading(false);
            // update batch status page
            if (res.ok) {
                getBatchRealizationStatus();
            } else {
                console.log("CancelSingleRequest Error: ", res);
            }
        }
    }

    const IndicatorIcon = (type) => {
        const typeColor = {
            "COMPLETE":"green.200",
            "PENDING":"gray.300",
            "RUNNING":"orange.300",
            "ERROR":"red.400"
        }
        return (
            <Flex align="center" justifyContent="center" px={1.5} py={1} borderRadius={5} bg={typeColor[type]}>
                <Text letterSpacing="-0.5px" fontWeight={700} color="blackAlpha.600">{type.toUpperCase()}</Text>
            </Flex>
        )
    }

    return (
        <Tr>
            <Td borderBottomWidth="1.5px" fontWeight={700}>{simRequest.rid + 1}</Td>
            <Td borderBottomWidth="1.5px" fontWeight={700}>{simRequest.guid}</Td>
            <Td borderBottomWidth="1.5px">
                <Flex>
                    {IndicatorIcon(simRequest.status)}
                    {simRequest.status === 'COMPLETE' ? (
                        <Flex onClick={() => setTabIndex(1)} _hover={{cursor: 'pointer', opacity: '0.78'}} opacity={1} ml="auto" bg="#6394F0" color="whiteAlpha.900" px={1.5} py={1} borderRadius={5}>
                            <Text fontWeight={600}>View</Text>
                        </Flex>
                    ) : (
                         <Flex onClick={() => cancelSingleRequest()} _hover={{cursor: (simRequest.status === 'PENDING' | simRequest.status === 'RUNNING') ? 'pointer' : 'no-drop', opacity: (simRequest.status === 'PENDING' | simRequest.status === 'RUNNING') ? '0.78' : '0.5'}} opacity={(simRequest.status === 'PENDING' | simRequest.status === 'RUNNING') ? '1' : '0.5'} ml="auto" bg="#f4f4f4" px={1.5} py={1} borderRadius={5}>
                            {loading ? (
                                <Spinner w="10px" h="10px" />
                            ) : (
                                <Text fontWeight={600}>Cancel</Text>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Td>
        </Tr>
    );
}
export default RequestsTableRow;