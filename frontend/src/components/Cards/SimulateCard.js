import { Flex, Text, Link, Box, Stack, Image, Divider, Input, Button } from '@chakra-ui/react';
import React from 'react';
import { useEffect, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Rectangle
  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import RequestsCard from './RequestsCard';
import { polarStereographicToLatLon, polarStereographicXToLongitude, polarStereographicYToLatitude, ll2ps, ps2ll } from '../../utils/utils';
import ArchivedRequestCard from './ArchivedRequestCard';
import toast from 'react-hot-toast';

const SimulateCard = ({
    csrf,
    isAuthenticated,
}) => {
    // TODO update to FORM view
    // represents current view for /simulate page can be: ['FORM','REQUEST','ARCHIVE'];
    const [viewState, setViewState] = useState("FORM");
    // Response value from POST request, used to pass into RequestCard component
    //TODO DEFAULT TO NONE 
    const [currentGUID, setCurrentGUID] = useState('70f1a90f-f34b-4441-ae08-40e0f951993f');

    const [loading, setLoading] = useState(false);
    const [latValues, setLatValues] = useState({
        maxx: 0,
        maxy: 0,
        minx: 0,
        miny: 0,
    })

    const [simulationForm, setSimulationForm] = useState({
        maxx: 0,
        maxy: 0,
        minx: 0,
        miny: 0,
        cellSize: 0,
        realizations: 0,
    });

    // TODO speak with mickey and fix conversion
    useEffect(() => {
        // const vals = ps2ll(
        //     simulationForm.minx, 
        //     simulationForm.miny, 
        //     simulationForm.maxx, 
        //     simulationForm.maxy
        // );
        // const latMaxX = polarStereographicXToLongitude(simulationForm.maxx);
        // const latMinX = polarStereographicXToLongitude(simulationForm.minx);
        // const latMaxY = polarStereographicYToLatitude(simulationForm.maxy);
        // const latMinY = polarStereographicYToLatitude(simulationForm.miny);
        // const vals = polarStereographicToLatLon(simulationForm.minx, simulationForm.miny, simulationForm.maxx, simulationForm.maxy);
        // setLatValues({
        //     maxx: Number(vals[3]),
        //     maxy: Number(vals[2]),
        //     minx: Number(vals[1]),
        //     miny: Number(vals[0])
        // })
        setLatValues({
                maxx: simulationForm.maxx,
                maxy: simulationForm.maxy,
                minx: simulationForm.minx,
                miny: simulationForm.miny
            })
    }, [simulationForm.maxx, simulationForm.maxy, simulationForm.miny, simulationForm.minx])

    // used for updating form input states
    const onChange = (event) => {
        setSimulationForm((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
    };

    const getSimulation = async (username, email) => {
        const request = await fetch(`/api/simulate`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            "X-CSRFToken": csrf,
         },
          body: JSON.stringify({
            user: username,
            email: email,
            ...simulationForm
          }),
        });
        const data = await request.json();
        return data;
      };

    const onSubmit = async (event) => {
        // set button state to loading
        setLoading(true);
        // prevent page refresh
        event.preventDefault();
        
        // obtain user email and auth state
        const res = await whoami();

        // TODO Display login required error
        if (!isAuthenticated) {
            toast.error('You must be signed in to submit requests', {
                style: {
                  border: '1px solid grey',
                  padding: '8px',
                  color: '#0E61FE',
                  fontWeight: 'bold',
                  fontFamily: `"IBM Plex Sans"`,
                },
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#0E61FE',
                },
            });
        };

        if (res.error) {
            console.log("error detected", res.error)
        } else {
            getSimulation(res.username, res.email)
            .then((response) => {
                setCurrentGUID(response.guid);
            })
            .then(() => {
                setLoading(false);
                setViewState("REQUEST");
            });
        }
        return
      };


    // used to obtain user email
    const whoami = async () => {
        const res = await fetch("/api/whoami/", {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
        })

        if (!res.ok) {
            const message = `An error has occured: ${res.status}`;
            console.log(message);
            return {'error': message}
        }
        const data = await res.json()
        return {'email': data.email, 'username': data.username}
    }

    return (
        <>  
            <Flex bg="white" border="1px solid black" mb={10} flexDirection={['column', 'column', 'row', 'row']} flexWrap='wrap'>
                {viewState === "REQUEST" && (
                    <RequestsCard csrf={csrf} isAuthenticated={isAuthenticated} requestGUID={currentGUID} requestData={simulationForm} />
                )}
                {viewState === "ARCHIVE" && (
                    <ArchivedRequestCard requestGUID={currentGUID} requestData={simulationForm} />
                )}
                {viewState === "FORM" && (
                    <>
                        <Flex width={["100%", "100%", "50%", "50%"]} bgColor="white" flexDirection='column' p="30px">
                            <Text fontWeight={600} fontSize="18pt" mb={2} >Simulate Greenland Topography</Text>
                            <Flex direction='column'  p={3}>

                                <form onSubmit={onSubmit}>

                                    <Text fontWeight={500} fontSize="14pt" mb={-1}>Coordinates</Text>
                                    <Text color="gray.600" mb={2}>In polar stenographical units</Text>
                                    <Flex flexDirection="row" mb={3} mr={5}>
                                        <Input placeholder="max x" _hover={{borderBottom: '2px solid grey'}} fontWeight={400}  onChange={onChange} name="maxx" required type="number" _active={{borderBottom: '2px solid #0E61FE'}} _focus={{boxShadow: "none", borderBottom: "2px solid #0E61FE"}} bg="#f4f4f4" border="none" mt={1} borderBottom='2px solid grey' borderRadius="0px"/>
                                        <Input ml={4} placeholder="max y" _hover={{borderBottom: "2px solid grey"}} fontWeight={400}  onChange={onChange} name="maxy" required type="number" _active={{borderBottom: '2px solid #0E61FE'}} _focus={{boxShadow: "none", borderBottom: "2px solid #0E61FE"}} bg="#f4f4f4"  border="none" mt={1} borderBottom='2px solid grey' borderRadius="0px"/>
                                    </Flex>
                                    <Flex flexDirection="row" mb={3} mr={5}>
                                        <Input placeholder="min x" _hover={{borderBottom: "2px solid grey"}} fontWeight={400}  onChange={onChange} name="minx" required type="number" _active={{borderBottom: '2px solid #0E61FE'}} _focus={{boxShadow: "none", borderBottom: "2px solid #0E61FE"}} bg="#f4f4f4" border="none" mt={1} borderBottom='2px solid grey' borderRadius="0px"/>
                                        <Input ml={4} placeholder="min y" _hover={{borderBottom: "2px solid grey"}} fontWeight={400}  onChange={onChange} name="miny" required type="number" _active={{borderBottom: '2px solid #0E61FE'}} _focus={{boxShadow: "none", borderBottom: "2px solid #0E61FE"}} bg="#f4f4f4" border="none" mt={1} borderBottom='2px solid grey' borderRadius="0px"/>
                                    </Flex>

                                    <Text mb={-1} fontWeight={500} fontSize="14pt">Resolution</Text>
                                    <Text color="gray.600" mb={2}>For grid cell size</Text>
                                    <Input mb={3} placeholder="resolution" _hover={{borderBottom: "2px solid grey"}} fontWeight={400}  onChange={onChange} name="cellSize" required type="number" _active={{borderBottom: '2px solid #0E61FE'}} _focus={{boxShadow: "none", borderBottom: "2px solid #0E61FE"}} bg="#f4f4f4" border="none" mt={1} borderBottom='2px solid grey' borderRadius="0px"/>
                                    
                                    <Text fontWeight={500} fontSize="14pt" mb={-1}>Number of Realizations</Text>
                                    <Text color="gray.600" mb={2}># of results sent to email</Text>
                                    <Input mb={3} placeholder="# of realizations" _hover={{borderBottom: "2px solid grey"}} fontWeight={400}  onChange={onChange} name="realizations" required type="number" _active={{borderBottom: '2px solid #0E61FE'}} _focus={{boxShadow: "none", borderBottom: "2px solid #0E61FE"}} bg="#f4f4f4" border="none" mt={1} borderBottom='2px solid grey' borderRadius="0px"/>
                                    <Button _hover={{opacity: "0.9"}} fontWeight={600} isLoading={loading} type="submit" fontSize="11pt" pl="15px" bg="linear-gradient(90deg, rgba(115,109,221,1) 0%, rgba(92,162,247,1) 100%, rgba(0,212,255,1) 100%);" color="white" borderRadius={0} mt={4} width="210px" height="48px">Generate Realizations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→</Button>
                                </form>
                                <Link href="/methodology" mt={3}>
                                    <Text fontSize="11pt" fontWeight={600} color="#0E61FE">Read more about the Methodology →</Text>
                                </Link>
                                <Link href="/about" mt={0.5}>
                                    <Text fontSize="11pt" fontWeight={600} color="#0E61FE">Learn about the Gator Glaciology Lab →</Text>
                                </Link>
                            </Flex>
                        </Flex>
                        <Flex width={["100%", "100%", "50%", "50%"]} bgColor="white" padding="30px">
                        <MapContainer minZoom={1} style={{height: "550px", width: "100%", border: '1px solid lightgray'}} center={[75.505, -40.09]} zoom={3} trackResize={false} dragging={false} doubleClickZoom={false} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                subdomains={['mt1','mt2','mt3']}
                            />
                            <Rectangle bounds={[[simulationForm.miny, simulationForm.minx],[simulationForm.maxy, simulationForm.maxx]]} pathOptions={{color: '#0E61FE'}} />
                        </MapContainer>
                        </Flex>
                    </>
                )}
            </Flex>

        </>
    )
}
export default SimulateCard;