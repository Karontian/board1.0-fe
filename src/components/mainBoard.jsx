import React, {useEffect, useState} from 'react'
import Header from "./header"
import Footer from "./footer"
import axios from 'axios'
import BoardGrid from './boardGrgid'

const MainBoard = () =>{

    // **** USE THIS IF NETLIFY SUPPORTS SPE  ****// 
    // useEffect(() => {
    //     const eventSource = new EventSource('http://localhost:3001/');
    
    //     eventSource.onmessage = (event) => {
    //         const clients = JSON.parse(event.data);
    //         console.log(clients);
    //     };
    
    //     return () => {
    //         eventSource.close();
    //     };
    // }, []);
        // **** USE THIS IF NETLIFY SUPPORTS SPE  ****// 
 
    //MAIN STATE
    
    //
    
    
    
    
    const [currentClients, setCurrentClients] = useState([])//Stores all companies information
    const [currentDrivers, setCurrentDrivers] = useState([])//Stores all drivers information

    //FETCHES CLIENTS AND DRIVERS FROM DB
    const fetchCurrentClients = async()=>{ //fetches companies
        // console.log('FETCHING CLIENTS')
        try {
            const req = await axios.get(`http://localhost:3001/getClients`)
            setCurrentClients(req.data.clients)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchCurrentDrivers = async()=>{//fetches drivers
        // console.log('FETCHING DRIVERS')
        try {
            const req = await axios.get(`http://localhost:3001/getDrivers`)
            setCurrentDrivers(req.data.drivers)
            // console.log('FETRCHED DRIVERS', req.data.drivers)
        } catch (error) {
            
        }
    }
    useEffect(() => { //Makes the fetch functions run 1/s
        const clientsIntervalId = setInterval(fetchCurrentClients, 1000);
        const driversIntervalId = setInterval(fetchCurrentDrivers, 1000);

        return () => {
            clearInterval(clientsIntervalId);
            clearInterval(driversIntervalId);
        }; // Cleanup the intervals on component unmount
    }, []);


    // console.log('CURRENT CLIENTS', currentClients, 'CURRENT DRIVERS', currentDrivers)

    return (
        <div className="mainContent-mainBoard">
            <div className="header-mainBoard">
                <Header/>
            </div>
            <div className="body-mainBoard">
                <div className="mainBoard-boardGrid">
                    <h1>Board 2.0</h1>  
                    <BoardGrid
                        currentClients={ currentClients }
                        currentDrivers={ currentDrivers }
                    />
                    
                </div>
            </div>
            <div className="footer-mainBoard">
                <Footer/>
            </div>
        </div>
    )
}

export default MainBoard