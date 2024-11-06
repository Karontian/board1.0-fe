import React, {useEffect, useState} from 'react'
import OfferModal from './offerModal'
import DispatcherModal from './dispatchReassignModal'
import DateForceChangeModal from './dateForceChangeModal'
import axios from 'axios'
import './boardGrid.css'

const BoardGrid = ({
    currentClients,
    currentDrivers,
    username

})=>{
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isDispatcherModalOpen, setIsDispatcherModalOpen] = useState(false);
    const [offeredDriver, setOfferedDriver] = useState('')
    const [selectedDriver, setSelectedDriver] = useState('')//Driver to whom we're changing the dispatcher
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);//force date change modal
    const [selectedDate, setSelectedDate] = useState('');//selected date holder
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

 
    
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };
    
    const getMCNumber = (driverCompanyId) => {
        const company = currentClients.find(company => company._id === driverCompanyId);
        return company ? company.mcNumber : '';
    };

    const sortedDrivers = [...currentDrivers].sort((a, b) => {//NEW currentDrivers sorted
        if (sortConfig.key) {
            let aValue = getNestedValue(a, sortConfig.key);
            let bValue = getNestedValue(b, sortConfig.key);
           
            if (sortConfig.key === 'mcNumber') {
                aValue = getMCNumber(a.driverCompany);
                bValue = getMCNumber(b.driverCompany);
            } else if (sortConfig.key === 'offers.total') {
                aValue = a.offers.accepted + a.offers.rejected;
                bValue = b.offers.accepted + b.offers.rejected;
            }


            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        }
        return 0;
    });

    const requestSort = (key) => {// SORTING ENGINE
        console.log('KEY', key)
        setSortConfig((prevSortConfig) => {
            let direction = 'ascending';
            if (prevSortConfig.key === key && prevSortConfig.direction === 'ascending') {
                direction = 'descending';
            }
            return { key, direction };
        });
    };

    const getSortIcon = (key) => {// SORTING ICON
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ?  '▲' : '▼';
        }
        return '↕';
    };


    const onOffer = async(e, driverId)=>{
        console.log('OFFER',e, driverId)
        setIsOfferModalOpen(true);
        setOfferedDriver(driverId)
    }
    
    const handleActiveStatusChange = async(driver, status) => {
        console.log('ACTIVE STATUS  CHANGE', driver, status)
        if (status === 'urgent' || status === 'not-urgent' || status === 'other-date') {
            try {
                const edition = await axios.put(`https://illustrious-dusk-6a3872.netlify.app/.netlify/functions/app/driverActiveStateOff/${driver}`, {driverLog: `*Driver '${driver}' set to INACTIVE by: ${username}`})//
                console.log('ACTIVE - INACTIVE', edition)

            } catch (err) {
                console.log(err)
            }

        } else {
            try {
                
                const edition = await axios.put(`https://illustrious-dusk-6a3872.netlify.app/.netlify/functions/app/driverActiveStateOn/${driver}`,{driverLog: `*Driver '${driver}' set to ACTIVE by: ${username}`})// {driverLog: `*Driver '${driver}', set to Active by: USER`}
                console.log('INACTIVE - ACTIVE', edition)
            } catch (err) {
                console.log(err)
            }
        }
    }
    const onDispatchReasign = async(e, driverId)=>{
        console.log('DISPATCH REASSIGN', driverId)
        setIsDispatcherModalOpen(true);
        setSelectedDriver(driverId)
    }
    const handleDispatcherConfirm = async(dispatcher)=>{
        console.log('DISPATCHER CHANGE CONFIRMED', dispatcher)
        try {
            const edition = await axios.put(`https://illustrious-dusk-6a3872.netlify.app/.netlify/functions/app/dispatcherReassign/${selectedDriver}`, {dispatcher, driverLog: `*${dispatcher} has been assigned to ${selectedDriver} by ${username}`})
            console.log(edition)
        } catch (err) {
            console.log(err)
        }
        setIsDispatcherModalOpen(false);

    }

    const onForceDateChange = async(driverId, date)=>{
        console.log('FORCE DATE CHANGE', driverId)
        setIsDateModalOpen(true)
        setSelectedDriver(driverId)
    }

    const onForceDateChangeConfirm = async(date, comment, newLocation)=>{
        console.log('FORCE DATE CHANGE CONFIRM', date, comment, newLocation)
        try {
            const edition = await axios.put(`https://illustrious-dusk-6a3872.netlify.app/.netlify/functions/app/dateForceChange/${selectedDriver}`, {
                date,
                logComment: `*${selectedDriver}'s available date has changed to ${date} and current location to ${newLocation} by ${username}`,
                comment,
                newLocation
            });
            console.log(edition)
            } catch (err) {
                console.error('Error updating date:', err);

        }
        setIsDateModalOpen(false)
    }


  
    console.log('CURRENT CLIENTS', currentClients, 'CURRENT DRIVERS', currentDrivers, 'SORTED DRIVERS', sortedDrivers)
    return (
        <div id='boardGrid-container'>
            <div id='boardGrid-table'>
                    <table>
                        <thead>
                            <tr>
                            <th onClick={() => requestSort('driverStatus')}>Status {getSortIcon('driverStatus')}</th>
                                <th onClick={() => requestSort('assignedDispatcher')}>Assigned Dispatcher {getSortIcon('assignedDispatcher')}</th>
                                <th onClick={() => requestSort('driverName')}>Driver {getSortIcon('driverName')}</th>
                                <th onClick={() => requestSort('driverPhoneNumber')}>Phone # {getSortIcon('driverPhoneNumber')}</th>
                                <th onClick={() => requestSort('driverCompany')}>Company {getSortIcon('driverCompany')}</th>
                                <th onClick={() => requestSort('mcNumber')}>MC# {getSortIcon('mcNumber')}</th>
                                <th onClick={() => requestSort('trailerInfo')}>Trailer Equipment {getSortIcon('trailerInfo')}</th>
                                <th onClick={() => requestSort('currentLocation')}>Current Location {getSortIcon('currentLocation')}</th>
                                <th onClick={() => requestSort('availableDate')}>Available Date {getSortIcon('availableDate')}</th>
                                <th onClick={() => requestSort('offers.accepted')}>Accepted {getSortIcon('offers.accepted')}</th>
                                <th onClick={() => requestSort('offers.rejected')}>Rejected {getSortIcon('offers.rejected')}</th>
                                <th onClick={() => requestSort('offers.total')}>Total Offers {getSortIcon('offers.total')}</th>

                                <th colSpan={3}>Driver Log</th>
                                <th>Offer</th>

                            </tr>
                        </thead>
                        <tbody>
                            {sortedDrivers.map((driver, index) => (
                                
                                <tr 
                                
                                    key={index} 
                                    className={`
                                        ${!(driver.driverStatus === 'urgent' || driver.driverStatus === 'not-urgent' || driver.driverStatus === 'other-date') ? 'disabled-row' : ''} 
                                        ${driver.driverStatus === 'urgent' ? 'available-row-urgent' : ''}
                                        ${driver.driverStatus === 'not-urgent' ? 'available-row-not-urgent' : ''}
                                        ${driver.driverStatus === 'other-date' ? 'available-row-other-date' : ''}


                                    `}>
                                    {/* <td>       
                                        <input 
                                            type="checkbox" 
                                            value={driver.driverStatus}
                                            checked={driver.driverStatus === 'urgent' || driver.driverStatus === 'not-urgent' || driver.driverStatus === 'other-date'} 
                                            onChange={()=>handleActiveStatusChange(driver._id, driver.driverStatus)}
                                            
                                        />

                                    </td>
                                    
                                    <td>{driver.assignedDispatcher} <button onClick={(e)=>onDispatchReasign(e,driver._id)}>Re-Assign</button></td> */}
                                    {username === 'admin' && (
                                        <>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    value={driver.driverStatus}
                                                    checked={driver.driverStatus === 'urgent' || driver.driverStatus === 'not-urgent' || driver.driverStatus === 'other-date'} 
                                                    onChange={() => handleActiveStatusChange(driver._id, driver.driverStatus)}
                                                />
                                            </td>
                                            <td>
                                                {driver.assignedDispatcher} 
                                                <button onClick={(e) => onDispatchReasign(e, driver._id)}>Re-Assign</button>
                                            </td>
                                        </>
                                    )}

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
                                    <td>{driver.availableDate} <button onClick={()=>onForceDateChange(driver._id)}>Force date Change</button></td>
                                    <td>{driver.offers.accepted} Accepted</td>
                                    <td>{driver.offers.rejected} Rejected</td>    
                                    <td>{driver.offers.accepted + driver.offers.rejected}</td>    
                                    {/* <td>    {driver.driverLog.map((logEntry, index) => (
                                            <div key={index}>{logEntry.comment}</div>
                                            ))}
                                    </td> */}
                                    <td colSpan={3}>
                                        <div className="driver-log-container">
                                            {driver.driverLog.slice(0, 10).map((logEntry, index) => (
                                                <div className="driver-log-entry" key={index}>{logEntry.comment}</div>
                                            ))}
                                            
                                        </div>
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
                    <DispatcherModal
                        isOpen={isDispatcherModalOpen}
                        currentDispatchers={ ['dispatcher1', 'dispatcher2', 'dispatcher3']}
                        onConfirm={handleDispatcherConfirm}
                        onCancel={() => setIsDispatcherModalOpen(false)}


                    />
                    <DateForceChangeModal
                        isOpen={isDateModalOpen}
                        onConfirm={onForceDateChangeConfirm}
                        onCancel={()=>setIsDateModalOpen(false)}
                    />
            </div>
        </div>    
    )
}


export default BoardGrid