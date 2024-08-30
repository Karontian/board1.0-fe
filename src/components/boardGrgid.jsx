import React, {useEffect, useState} from 'react'

const BoardGrid = ({
    currentClients,
    currentDrivers

})=>{

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
                                checked={driver.driverStatus === 'urgent' || driver.driverStatus === 'notUrgent' || driver.driverStatus === 'otherDate'} 
                                readOnly 
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
                        <td>
                            <button type='button'>+1Offer</button>
                            <button type='button'>#R</button>  

                        </td>    

                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
}


export default BoardGrid