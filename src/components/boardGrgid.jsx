import React, {useEffect, useState} from 'react'
import OfferModal from './offerModal'
import axios from 'axios'

const BoardGrid = ({
    currentClients,
    currentDrivers

})=>{
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [offeredDriver, setOfferedDriver] = useState('')
    



    const onOffer = async(e, driverId)=>{
        console.log('OFFER',e, driverId)
        setIsOfferModalOpen(true);
        setOfferedDriver(driverId)

    }
    const handleActiveStatusChange = async(driver, status) => {
        console.log('ACTIVE STATUS  CHANGE', driver, status)
        if (status === 'urgent' || status === 'notUrgent' || status === 'otherDate') {
            try {
                const edition = await axios.put(`http://localhost:3001/driverActiveStateOff/${driver}`, {driverLog: `*Driver '${driver}' set to INACTIVE by: USER`})//
                console.log('ACTIVE - INACTIVE', edition)

            } catch (err) {
                console.log(err)
            }

        } else {
            try {
                
                const edition = await axios.put(`http://localhost:3001/driverActiveStateOn/${driver}`,{driverLog: `*Driver '${driver}' set to ACTIVE by: USER`})// {driverLog: `*Driver '${driver}', set to Active by: USER`}
                console.log('INACTIVE - ACTIVE', edition)
            } catch (err) {
                console.log(err)
            }
        }
    };


  
    console.log('CURRENT CLIENTS', currentClients, 'CURRENT DRIVERS', currentDrivers)
    return (
        <div id='boardGrid-table'>
        <h2>Board Grid</h2>
        <table>
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Assigned  Dispather</th>
                    <th>Driver</th>
                    <th>Phone #</th>
                    <th>Company</th>
                    <th>MC#</th>
                    <th>Trailer Equipment</th>
                    <th>Current Location</th>
                    <th>Available Date</th>
                    <th>Accepted</th>
                    <th>Rejected</th>
                    <th>total Offers</th>
                    <th>Driver Log</th>
                    <th></th>

                </tr>
            </thead>
            <tbody>
                {currentDrivers.map((driver, index) => (
                    <tr key={index}>
                        <td>       
                            {/* <input type="checkbox" checked={driver.status} readOnly /> */}
                            <input 
                                type="checkbox" 
                                value={driver.driverStatus}
                                checked={driver.driverStatus === 'urgent' || driver.driverStatus === 'notUrgent' || driver.driverStatus === 'otherDate'} 
                                onChange={()=>handleActiveStatusChange(driver._id, driver.driverStatus)}
                                 
                            />

                        </td>
                        
                        <td>{driver.assignedDispatcher} <button>Re-Assign</button></td>
                        <td>{driver.driverName}</td>
                        <td>{driver.driverPhoneNumber}</td>
                        
                        <td> 
                            {currentClients
                                .filter((company) => driver.driverCompany === company._id)
                                .map((company) => company.companyName) 
                            }
                        </td>
                        <td>
                            {currentClients
                            .filter((company) => driver.driverCompany === company._id)
                            .map((company)=> company.mcNumber)
                            }
                        </td>

                        <td>
                            {driver.trailerInfo
                                .filter(trailer => trailer.amount > 0)
                                .map(trailer => 
                                    trailer.type + ' ' + '(' + trailer.length + ')' + ' ' + trailer.amount + (trailer.def === true ? ' DEF' : '')
                                )
                                .join(' ')
                            }
                        </td>
                        <td>{driver.currentLocation}</td>
                        <td>{driver.availableDate} <button>Change</button></td>
                        <td>{driver.offers.accepted} Accepted</td>
                        <td>{driver.offers.rejected} Rejected</td>    
                        <td>{driver.offers.accepted + driver.offers.rejected}</td>    
                        <td>    {driver.driverLog.map((logEntry, index) => (
                                <div key={index}>{logEntry.comment}</div>
                                 ))}
                        </td>
                        <td>
                            <button onClick={e=>onOffer(e, driver._id)} type='button'>+1Offer</button>

                        </td> 

                    </tr>
                ))}
            </tbody>
        </table>
        <OfferModal
            isOpen={isOfferModalOpen}
            offeredDriver = {offeredDriver}
            onRequestClose={() => setIsOfferModalOpen(false)}
            
        />
        </div>
    )
}


export default BoardGrid