//WORKING TABLE CODE 
<table>
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Company Phone#</th>
                            <th>Owner Name</th>
                            <th>Owner Phone#</th>
                            <th>Address</th>
                            <th>MC#</th>
                            <th>DOT#</th>
                            <th>EIN#</th>
                            <th>Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                    {Array.from(currentClients).map((client, index) => (//DISPPLAYS COMPANY AND NESTS DRIVERS TABLE
                      editingCompanyIndex === index ? // Check if this is the company being edited
                        <React.Fragment key={index}>
                         <tr>
                            <td><input type="text" value={client.companyName} onChange={(e) => handleClientChange(index, 'companyName', e.target.value)} /></td>
                            <td><input type="text" value={client.companyPhoneNumber} onChange={(e) => handleClientChange(index, 'companyPhoneNumber', e.target.value)} /></td>
                            <td><input type="text" value={client.ownerName} onChange={(e) => handleClientChange(index, 'ownerName', e.target.value)} /></td>
                            <td><input type="text" value={client.ownerPhoneNumber} onChange={(e) => handleClientChange(index, 'ownerPhoneNumber', e.target.value)} /></td>
                            <td><input type="text" value={client.address} onChange={(e) => handleClientChange(index, 'address', e.target.value)} /></td>
                            <td><input type="text" value={client.mcNumber} onChange={(e) => handleClientChange(index, 'mcNumber', e.target.value)} /></td>
                            <td><input type="text" value={client.dotNumber} onChange={(e) => handleClientChange(index, 'dotNumber', e.target.value)} /></td>
                            <td><input type="text" value={client.einNumber} onChange={(e) => handleClientChange(index, 'einNumber', e.target.value)} /></td>
                            <td>
                                <button onClick={(e) => onCompanyEditSave(e, index, client._id)} type='button'>Save</button>
                                <button onClick={(e) => onCompanyEditCancel(e, index)} type='button'>Cancel</button>
                            </td>                           
                        </tr>                        
                        </React.Fragment>
                        : // Default view
                        <React.Fragment key={index}>
                        <tr>
                            <td>{client.companyName}</td>
                            <td>{client.companyPhoneNumber}</td>
                            <td>{client.ownerName}</td>
                            <td>{client.ownerPhoneNumber}</td>
                            <td>{client.address}</td>
                            <td>{client.mcNumber}</td>
                            <td>{client.dotNumber}</td>
                            <td>{client.einNumber}</td>
                            <td>
                            <button onClick={(e) => onCompanyEdit(e, index)} type='button'>Edit</button>
                            <button onClick={(e) => onCompanyDelete(e, client._id, client.companyName)} type='button'>Delete</button>
                            </td>
                        </tr>
                        <tr> 
                            <td colSpan="9"> {/* Span across all columns */}
                            <table> {/* NESTED DRIVER TABLE */}
                            <thead>
                                <tr>
                                <th>Drivers:</th>
                                </tr>
                                <tr>
                                <th>Driver Name</th>
                                <th>Driver Phone Number</th>
                                <th>Current Location</th>
                                <th>Available Date</th>
                                <th>Trailer Equipment</th>
                                <th>Securing Equipment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDrivers.filter(driver => driver.driverCompany === client.companyName).map((driver, driverIndex) => (
                                <tr key={`driver-${driverIndex}`}>
                                    <td>{driver.driverName}</td>
                                    <td>{driver.driverPhoneNumber}</td>
                                    <td>
                                    <ul>
                                        {driver.trailerInfo.map((trailer, index) => (
                                        trailer.amount > 0 ? 
                                        <li key={index}>{`${trailer.amount} ${trailer.type} ${trailer.length}`}</li> 
                                        : null
                                        ))}
                                    </ul>
                                    </td>
                                    <td>
                                    <ul>
                                        {driver.selectedEquipment.map((eq, index) => (
                                        eq.qty > 0 ?
                                        <li key={index}>{`${eq.type} qty: ${eq.qty}`}</li>
                                        : null
                                        ))}
                                    </ul>
                                    </td>
                                    <td>{driver.availableDate}</td>
                                    <td>{driver.currentLocation}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                            </td>
                        </tr>
                        </React.Fragment>
                    ))}
                    </tbody>
                    <tfoot></tfoot>
</table>