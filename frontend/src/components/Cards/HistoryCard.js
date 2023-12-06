import { Flex, Text, Spinner, Select, TableContainer, Table, Tbody, Thead, Tr, Th,  } from '@chakra-ui/react';
import React from 'react';
import { useEffect, useState } from 'react';
import { getUserSimulations } from '../../utils/utils';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import HistoryTableRow from '../Table/HistoryTableRow';

const HistoryCard = ({
    csrf,
    isAuthenticated,
    username,
}) => {
    const [requestHistory, setRequestHistory] = useState([]);
    const [paginatedData, setPaginatedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(10);

    const sortHistory = (key) => {
        const temp = [...requestHistory];

        if (key === "GUID") { temp.sort((a,b) => a.guid > b.guid ? 1 : -1)}
        else if (key == "DATE") { temp.sort((a,b) => a.date > b.date ? 1 : -1)}
        else if (key == "REALIZATIONS") { temp.sort((a,b) => a.realizations - b.realizations)}
  
        setRequestHistory(temp);
    }

    const getRequestHistory = async () => {
        setLoading(true)
        try {
            const res = await getUserSimulations();
            const tempData = [...res].slice(0, resultsPerPage);
            setPaginatedData(tempData);
            setRequestHistory(res);
            setLoading(false)
        } catch (e) {
            console.log("getRequestHistory Error: ", e);
            setLoading(false)
        }
    }

    useEffect(() => {getRequestHistory()}, [])

    // update results per page on change (pagination controls)
    useEffect(() => {
        const tempData = [...requestHistory].slice((pageIndex - 1) * resultsPerPage, Number((pageIndex - 1) * resultsPerPage) + Number(resultsPerPage));
        setPaginatedData(tempData);
    }, [pageIndex, requestHistory])

    useEffect(() => {
        setPageIndex(1);
        const tempData = [...requestHistory].slice(0, resultsPerPage);
        setPaginatedData(tempData);
    }, [resultsPerPage, requestHistory])

    if (!isAuthenticated) {
        return (
            <Flex bg="white" border="1px solid black" mb={10} flexDirection={['column', 'column', 'row', 'row']} flexWrap='wrap'>
                <Flex width={["100%", "100%", "50%", "50%"]} bgColor="white" flexDirection='column' p="30px">
                    <Text fontWeight={600} fontSize="18pt" mb={2}>No User Found.</Text>
                    <Text _hover={{textDecoration: 'underline', cursor: 'pointer'}} color="blue.400" onClick={() => window.location.href='/login'}>Login Here</Text>
                </Flex>
            </Flex>
        )
    }

    return (
        <>  
            <Flex bg="white" border="1px solid black" mb={10} flexDirection={['column', 'column', 'row', 'row']} flexWrap='wrap'>
                <Flex width="100%" bgColor="white" flexDirection='column' p="30px">
                    <Text fontWeight={600} fontSize="18pt" mb={2}>Request History</Text>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <Flex mt={0} mb={-3} align="center">
                                <Flex onClick={() => setPageIndex(Math.max(1, pageIndex - 1))} _hover={{cursor: 'pointer', opacity: 0.7}} h="32px" w="32px" bg="#F4F4F4" p={2} align="center" justifyContent="center">
                                    <FaAngleLeft fontSize="13.5pt" color="#4A5567" />
                                </Flex>
                                <Flex onClick={() => {resultsPerPage * pageIndex >= requestHistory.length ? null : setPageIndex(pageIndex + 1)}} _hover={{cursor: 'pointer', opacity: 0.7}} ml={3} h="32px" w="32px" bg="#F4F4F4" p={2} align="center" justifyContent="center">
                                    <FaAngleRight fontSize="13.5pt" color="#4A5567" />
                                </Flex>
                                <Text ml={4} color="#4A5567" fontSize="10.5pt" fontStyle="italic" userSelect="none">Viewing requests {((pageIndex - 1) * resultsPerPage + 1)} - {resultsPerPage * pageIndex > requestHistory.length ? requestHistory.length : resultsPerPage * pageIndex} of {requestHistory.length}</Text>
                                <Text ml="auto" color="#4A5567" fontSize="10.5pt" userSelect="none">Results per page</Text>
                                <Select onChange={(v) => setResultsPerPage(v.target.value)} value={resultsPerPage} focusBorderColor='#065FFF' fontSize="10.5pt" color="#4A5567" ml={2} w="54px" variant='flushed'>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={50}>50</option>
                                </Select>
                            </Flex>
                            <TableContainer mt={5} w="100%">
                                <Table size='sm'>
                                    <Thead>
                                    <Tr bg="#f4f4f4">
                                        <Th onClick={() => sortHistory("GUID")} py={2.5} borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt" width="50%"><Text _hover={{cursor: "pointer"}} width="-webkit-fit-content">GUID</Text></Th>
                                        <Th onClick={() => sortHistory("DATE")} borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt"><Text _hover={{cursor: "pointer"}} width="-webkit-fit-content">Date Created</Text></Th>
                                        <Th onClick={() => sortHistory("REALIZATIONS")} borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt"><Flex align="center"><Text _hover={{cursor: "pointer"}} width="-webkit-fit-content">REALIZATIONS&nbsp;</Text><Text ml='auto'>ACTION</Text></Flex></Th>
                                    </Tr>
                                    </Thead>
                                    <Tbody>
                                        {paginatedData.map((simRequest, i) => {
                                            return (
                                                <HistoryTableRow
                                                    key={i} 
                                                    simRequest={simRequest}
                                                    csrf={csrf}
                                                />
                                            )
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                 </Flex>
            </Flex>

        </>
    )
}
export default HistoryCard;