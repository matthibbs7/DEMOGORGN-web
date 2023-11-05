import { Flex, Text, Link, Box, Stack, Image, Divider, Input, Button } from '@chakra-ui/react';
import React from 'react';
import { useEffect, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    useMap,
    Rectangle
  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import { IoFlagSharp } from 'react-icons/io5';

const HOST_PREFIX = process.env.HOST_PREFIX ?? 'http://127.0.0.1:8000';

const SimulateCard = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [csrf, setCsrf] = useState("");

    useEffect(() => {
        getSession();
    }, [])

    const getSession = () => {
        fetch("/api/session/", {
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("session data:", data);
            if (data.isAuthenticated) {
                whoami();
                setIsAuthenticated(true);
                getCSRF();
                
            } else {
                setIsAuthenticated(false);
                getCSRF();
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const getCSRF = () => {
        fetch("/api/csrf/", {
            credentials: "include",
        })
        .then((res) => {
            let csrfToken = res.headers.get("X-CSRFToken");
            setCsrf(csrfToken);
            console.log('csrf:',csrfToken);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const [loading, setLoading] = useState(false);
    const [simulationForm, setSimulationForm] = useState({
        maxx: 0,
        maxy: 0,
        minx: 0,
        miny: 0,
        cellSize: 0,
        realizations: 0,
    });

    // used for updating form input states
    const onChange = (event) => {
        setSimulationForm((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
    };

    const getSimulation = async (username, email) => {
        // `${HOST_PREFIX}/rewording`
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

        if (res.error) {
            console.log("error detected", res.error)

            // not logged in? set error
            
        } else {
            getSimulation(res.username, res.email)
            .then((response) => {
                console.log('Sim res', response);
            })
            .then(() => setLoading(false));
        }

        // console.log(res)
        // console.log(simulationForm)
        // console.log("username", username)
        // console.log("email", email)
        return

        // call backend API
        getSimulation()
            .then((response) => {
            console.log(response);
            })
            .then(() => setLoading(false));
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


        // .then((res) => res.json())
        // .then((data) => {
        //     setEmail(data.email)
        //     setUsername(data.username)
        //     return 'ok'
        // })
        // .catch((err) => {
        //     return err
        // });
    }

    return (
        <>  
            <Flex bg="white" border="1px solid black" flexDirection={['column', 'column', 'row', 'row']} flexWrap='wrap'>
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
                            
                            {/* <Text fontWeight={700} fontSize="14pt" mb={2}>Email</Text>
                            <Flex mb={5} flexDir="column">
                                    <Input placeholder="email" _hover={{border: "2px solid #f4f4f4"}} fontWeight={400}  onChange={onChange} name="password" required type="number" _active={{border: '2px solid', borderColor: '#0E61FE'}} _focus={{boxShadow: "none", borderTop: "2px solid #0E61FE", borderRight: "2px solid #0E61FE", borderLeft: "2px solid #0E61FE", bg: 'white', borderBottom: "2px solid transparent"}} bg="#f4f4f4" borderTop="2px solid transparent" mt={1} borderLeft="2px solid transparent" borderRight="2px solid transparent" borderBottom='2px solid transparent' borderRadius="0px"/>
                                    <Box zIndex={2} mt={-0.5} width="100%" bg="grey" height="2px"></Box>
                                </Flex> */}
                            {/* <Input height="35px" onChange={onChange} name="email" required _hover={{borderColor: '#2C6DAA', borderWidth: '1.5px'}} mb={5} borderColor="#161616" placeholder='Enter email' /> */}
                            <Button fontWeight={600} isLoading={loading} type="submit" fontSize="11pt" pl="15px" _hover={{backgroundColor: '#044dd4'}} bg="linear-gradient(90deg, rgba(115,109,221,1) 0%, rgba(92,162,247,1) 100%, rgba(0,212,255,1) 100%);" color="white" borderRadius={0} mt={4} width="210px" height="48px">Generate Realizations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→</Button>
                            {/* <Button _hover={{bgColor: '#108bfe'}} isLoading={loading} type="submit" backgroundColor="#0E61FE" color='white'>Generate Realizations</Button> */}
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
                <MapContainer minZoom={3} style={{height: "550px", width: "100%", border: '1px solid lightgray'}} center={[75.505, -40.09]} zoom={3} trackResize={false} dragging={false} doubleClickZoom={false} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                        subdomains={['mt1','mt2','mt3']}
                    />
                    <Rectangle bounds={[[simulationForm.maxx, simulationForm.maxy],[simulationForm.minx, simulationForm.miny]]} pathOptions={{color: '#0E61FE'}} />
                </MapContainer>
                </Flex>
            </Flex>

        </>
    )
}
export default SimulateCard;