import React, {useEffect, useState} from 'react'
import Header from "./header"
import Footer from "./footer"

const MainBoard = () =>{

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3001/');
    
        eventSource.onmessage = (event) => {
            const clients = JSON.parse(event.data);
            console.log(clients);
        };
    
        return () => {
            eventSource.close();
        };
    }, []);



    return (
        <div className="mainContent-mainBoard">
            <div className="header-mainBoard">
                <Header/>
            </div>
            <div className="body-mainBoard">
                <div className="boardGrid-mainBoard">

                </div>
            </div>
            <div className="footer-mainBoard">
                <Footer/>
            </div>
        </div>
    )
}

export default MainBoard