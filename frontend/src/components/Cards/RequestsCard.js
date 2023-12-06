import React, { useEffect, useState } from 'react';
import { Text, Tabs, TabList, Image, Tab, TabPanel, TabPanels, Flex, useDisclosure } from '@chakra-ui/react'
import { FaRegShareSquare } from 'react-icons/fa';

import CancelModal from '../Modals/CancelModal';

import { getBatchRequestsFromGUID, getLookupRequestFromGUID, getUserSimulations, sleep, timeSince } from '../../utils/utils';

import CompletedTab from '../Tabs/CompletedTab';
import RequestsTab from '../Tabs/RequestsTab';
import HistoryTab from '../Tabs/HistoryTab';

const RequestsCard = ({
    csrf,
    isAuthenticated,
    requestGUID,
    requestData,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [requestLoading, setRequestLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const [date, setDate] = useState("");

    // user historic data
    const [requestHistory, setRequestHistory] = useState([]);

    // table data
    const [rawBatchData, setRawBatchData] = useState([]);
    const [completedRequests, setCompletedRequests] = useState([]);
    const [paginatedData, setPaginatedData] = useState([]);
    const [resultsPerPage, setResultsPerPage] = useState(5);

    // TODO remove -> redirect to new page/modal with image
    const [previewImageSrc, setPreviewImageSrc] = useState("");
    
    // create obj on client to store image srcs so we don't have to call api again (semi-cache)
    const [savedPreviewImages, setSavedPreviewImages] = useState({});
    const [currentPreviewRID, setCurrentPreviewRID] = useState();

    const getTimeSince = (timestamp) => {
        var localDate = new Date(timestamp)
        try {
            return timeSince(localDate)
        } catch (error) {
            console.log("timeSince Error: ", error)
        }     
    }

    const getShareLink = async () => {
        navigator.clipboard.writeText(`https://demogorgn.rc.ufl.edu/request/${requestGUID}`);
        setIsCopied(true);
        await sleep(1600);
        setIsCopied(false);
    }

    useEffect(() => {
        try {
            setInterval(async () => {
                // pull batch get status every minute for request
                if (rawBatchData.length > 0 && rawBatchData.length === completedRequests.length) return;
                const { statuses } = await getBatchRequestsFromGUID(requestGUID, csrf);
                setRawBatchData(statuses);
                const completedVals = statuses.filter((realization) => realization.status === "COMPLETE");
                const tempData = [...completedVals].slice(0, resultsPerPage);
                setCompletedRequests(completedVals)
                setPaginatedData(tempData);
            }, 60000)
        } catch (e) {
            console.log(e);
        }
    }, []);

    const getBatchRealizationStatus = async () => {
        if (!requestLoading) return;
        setRefreshLoading(true)
        
        const { statuses } = await getBatchRequestsFromGUID(requestGUID, csrf);
        setRawBatchData(statuses);
        
        const completedVals = statuses.filter((realization) => realization.status === "COMPLETE");
        const tempData = [...completedVals].slice(0, resultsPerPage);
        
        // include COMPLETED, ERROR, OR CANCELLED VALUES
        const finishedVals = statuses.filter((realization) => realization.status === "COMPLETE" || realization.status === "ERROR" || realization.status === "CANCELLED")
        if (finishedVals.length === statuses.length) {
            setRequestLoading(false);
        }
        setCompletedRequests(completedVals)
        setPaginatedData(tempData);
        setRefreshLoading(false)
        await getLookupDataDate();
    }
    useEffect(() => {getBatchRealizationStatus()}, [])

    const getRequestHistory = async () => {
        try {
            const res = await getUserSimulations();
            setRequestHistory(res);
        } catch (e) {
            console.log("getRequestHistory Error: ", e);
        }
    }

    const getLookupDataDate = async () => {
        try {
            const res = await getLookupRequestFromGUID(requestGUID, csrf);
            var localDate = new Date(res.date);
            setDate(timeSince(localDate));
        } catch (e) {
            console.log("getLookupData Error: ", e);
        }
    }

    useEffect(() => {
        getRequestHistory()
        getLookupDataDate()
    }, [])

    return (
        <Flex p="30px" w="100%" h="100%" flexDir="column">
            <CancelModal isOpen={isOpen} onClose={onClose} requestGUID={requestGUID} csrf={csrf}  />
            <Flex align="center">
                <Text fontWeight={600} fontSize="18pt" mb={2}>Request Overview</Text>
                <Flex bg="#fff" border="1px solid #d3d3d3" borderRadius={2} gap="1" ml="auto" px={2} align="center" justifyContent="center" h="32px">
                    <Text color="#222" fontStyle="italic" fontWeight={500} fontSize="14px">Submitted {date} ago</Text>
                </Flex>
                <Flex onClick={() => getShareLink()} _hover={{opacity: "0.9", cursor: "pointer"}} bg="cornflowerblue" gap="1" ml="4" px={2} align="center" justifyContent="center" borderRadius={2} h="32px">
                    <FaRegShareSquare color="white" />
                    <Text color="white" fontWeight={500} fontSize="14px">{isCopied ? 'Copied' : 'Share'}</Text>
                </Flex>
            </Flex>
            <Flex align="center">
                {previewImageSrc.length > 0 && (
                    <Flex flexDirection="column" maxW="300px" align="center" justifyContent="center">
                        <Text color="#1A202C" fontSize="11px" fontStyle="italic">Currently Viewing RID #{currentPreviewRID+1}</Text>
                        <Image maxW="300px" maxH="300px" src={previewImageSrc} />
                    </Flex>
                )}
                <Flex justifyContent="center" flexDirection="column" p={4} h="306.5px" w="400px">
                    <Flex flexDirection="column">
                        
                        <Flex px={1} borderRadius={4} w="-webkit-fit-content" gap="2" bg="#F4F4F4" border="1.5px solid #D3D3D3">
                            <Flex>
                                <Text fontSize="12pt" fontWeight={600}>Max X:&nbsp;</Text>
                                <Text fontSize="12pt">{requestData.maxx}</Text>
                            </Flex>
                            <Flex>
                                <Text fontSize="12pt" fontWeight={600}>Max Y:&nbsp;</Text>
                                <Text fontSize="12pt">{requestData.maxy}</Text>
                            </Flex>
                        </Flex>
                        <Flex mt={1.5} px={1} borderRadius={4} w="-webkit-fit-content" gap="2" bg="#F4F4F4" border="1.5px solid #D3D3D3">
                            <Flex>
                                <Text fontSize="12pt" fontWeight={600}>Min X:&nbsp;</Text>
                                <Text fontSize="12pt">{requestData.minx}</Text>
                            </Flex>
                            <Flex>
                                <Text fontSize="12pt" fontWeight={600}>Min Y:&nbsp;</Text>
                                <Text fontSize="12pt">{requestData.miny}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex mt={1.5} borderRadius={4} px={1} w="-webkit-fit-content" bg="#F4F4F4" border="1.5px solid #D3D3D3">
                        <Text fontSize="12pt" fontWeight={600}>Resolution:&nbsp;</Text>
                        <Text fontSize="12pt">{requestData.cellSize}</Text>
                    </Flex>
                    <Flex mt={1.5} borderRadius={4} px={1} w="-webkit-fit-content" bg="#F4F4F4" border="1.5px solid #D3D3D3">
                        <Text fontSize="12pt" fontWeight={600}>Realizations:&nbsp;</Text>
                        <Text fontSize="12pt">{requestData.realizations}</Text>
                    </Flex>
                    <Flex mt={1.5} borderRadius={4} px={1} w="-webkit-fit-content" bg="#F4F4F4" border="1.5px solid #D3D3D3">
                            <Text fontSize="12pt" fontWeight={600}>GUID:&nbsp;</Text>
                            <Text fontSize="12pt">{requestGUID}</Text>
                    </Flex>
                </Flex>
                
            </Flex>
            <Tabs index={tabIndex}>
                <TabList>
                    <Tab onClick={() => setTabIndex(0)} _selected={{ color: '#0560FF', borderColor: '#0560FF'}}>Requests</Tab>
                    <Tab onClick={() => setTabIndex(1)} _selected={{ color: '#0560FF', borderColor: '#0560FF'}}>Completed {rawBatchData.length > 0 ? `(${completedRequests.length}/${rawBatchData.length})` : ''}</Tab>
                    <Tab onClick={() => setTabIndex(2)} disabled={!requestHistory || requestHistory.length === 0} ml="auto" _selected={{ color: '#0560FF', borderColor: '#0560FF'}}>History {requestHistory.length !== 0 && `(${requestHistory.length})`}</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel px={0}>
                        <RequestsTab
                            rawBatchData={rawBatchData}
                            completedRequests={completedRequests}
                            refreshLoading={refreshLoading}
                            requestLoading={requestLoading}
                            setTabIndex={setTabIndex}
                            getBatchRealizationStatus={getBatchRealizationStatus}
                            onOpen={onOpen}
                            csrf={csrf}
                        />
                    </TabPanel>
                    <TabPanel px={0}>
                        <CompletedTab 
                            completedRequests={completedRequests}
                            paginatedData={paginatedData}
                            setPaginatedData={setPaginatedData}
                            resultsPerPage={resultsPerPage}
                            setResultsPerPage={setResultsPerPage}
                            setPreviewImageSrc={setPreviewImageSrc} 
                            savedPreviewImages={savedPreviewImages}
                            setSavedPreviewImages={setSavedPreviewImages}
                            currentPreviewRID={currentPreviewRID}
                            setCurrentPreviewRID={setCurrentPreviewRID}
                        />
                    </TabPanel>
                    <TabPanel px={0}>
                        <HistoryTab requestHistory={requestHistory} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
            
        </Flex>
    )
}
export default RequestsCard;