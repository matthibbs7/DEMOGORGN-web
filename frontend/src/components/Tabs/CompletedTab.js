import React, { useState, useEffect } from 'react';
import { Tr, Th, Flex, Text, Select, TableContainer, Table, Thead, Tbody } from "@chakra-ui/react";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

import CompletedTableRow from '../Table/CompletedTableRow';

const CompletedTab = ({
    completedRequests,
    paginatedData,
    setPaginatedData,
    resultsPerPage,
    setResultsPerPage,
    setPreviewImageSrc,
    savedPreviewImages,
    setSavedPreviewImages,
    currentPreviewRID,
    setCurrentPreviewRID,
}) => {
    // pagination controls
    const [pageIndex, setPageIndex] = useState(1);
    
    // update results per page on change (pagination controls)
    useEffect(() => {
        const tempData = [...completedRequests].slice((pageIndex - 1) * resultsPerPage, Number((pageIndex - 1) * resultsPerPage) + Number(resultsPerPage));
        setPaginatedData(tempData);
    }, [pageIndex, completedRequests])

    useEffect(() => {
        setPageIndex(1);
        const tempData = [...completedRequests].slice(0, resultsPerPage);
        setPaginatedData(tempData);
    }, [resultsPerPage, completedRequests])

    return (
        <>
            <Flex mt={0} mb={-3} align="center">
                <Flex onClick={() => setPageIndex(Math.max(1, pageIndex - 1))} _hover={{cursor: 'pointer', opacity: 0.7}} h="32px" w="32px" bg="#F4F4F4" p={2} align="center" justifyContent="center">
                    <FaAngleLeft fontSize="13.5pt" color="#4A5567" />
                </Flex>
                <Flex onClick={() => {resultsPerPage * pageIndex >= completedRequests.length ? null : setPageIndex(pageIndex + 1)}} _hover={{cursor: 'pointer', opacity: 0.7}} ml={3} h="32px" w="32px" bg="#F4F4F4" p={2} align="center" justifyContent="center">
                    <FaAngleRight fontSize="13.5pt" color="#4A5567" />
                </Flex>
                <Text ml={4} color="#4A5567" fontSize="10.5pt" fontStyle="italic">Realizations {((pageIndex - 1) * resultsPerPage + 1)} - {resultsPerPage * pageIndex > completedRequests.length ? completedRequests.length : resultsPerPage * pageIndex} of {completedRequests.length}</Text>
                <Text ml="auto" color="#4A5567" fontSize="10.5pt">Results per page</Text>
                <Select onChange={(v) => setResultsPerPage(v.target.value)} value={resultsPerPage} focusBorderColor='#065FFF' fontSize="10.5pt" color="#4A5567" ml={2} w="54px" variant='flushed'>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                </Select>
            </Flex>
            <TableContainer mt={5}>
                <Table border="2px solid #F4F4F4" size='sm'>
                    <Thead>
                    <Tr bg="#f4f4f4">
                        <Th borderColor="lightgrey" borderBottomWidth="2px" py={2.5} letterSpacing="-0.5px" fontSize="11pt">RID</Th>
                        <Th borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt" width="50%">GUID</Th>
                        <Th borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt"><Flex><Text>ACTIONS</Text><Text ml='auto'></Text></Flex></Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {paginatedData.map((simRequest, i) => {
                            return (
                                <CompletedTableRow 
                                    key={i} 
                                    simRequest={simRequest} 
                                    setPreviewImageSrc={setPreviewImageSrc} 
                                    savedPreviewImages={savedPreviewImages} 
                                    setSavedPreviewImages={setSavedPreviewImages} 
                                    currentPreviewRID={currentPreviewRID}
                                    setCurrentPreviewRID={setCurrentPreviewRID}
                                />
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </>             
    )
}
export default CompletedTab;