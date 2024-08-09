import React, {useState} from 'react';
import AddTrailerModal from './addTrailerModal';
import AddEquipmentModal from './addEquipmentModal';

const DriverAdmin = ({
  client,
  editingDriverIndex,
  editingDriverCompany,
  onHandleDriverChange,
  onDriverEditSave,
  onDriverEdit,
  onDriverDelete,
  onDriverTrailerDelete,
  onDriverTrailerAdd,
  onDriverEquipmentDelete,
  onDriverEquipmentAdd,
  currentDrivers
  
}) => {

const [isModalOpen, setIsModalOpen] = useState(false)
const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false); // State for the new modal
const [currentDriverId, setCurrentDriverId] = useState('')

const handleAddTrailerClick = (e, driverId) =>{ //OPENS TRAILERS MODAL
    console.log('DRIVER ADDMING OPENING MODAL', e, driverId)
    setCurrentDriverId(driverId)
    setIsModalOpen(true)
}

const handleAddEquipmentClick = (e, driverId)=>{ //OPENS EQUIPMENT MODAL
    console.log('EQUIPMENT ADDING OPEN MODAL', driverId)
    setCurrentDriverId(driverId);
    setIsEquipmentModalOpen(true)

}

const handleModalSubmit = (amount,  type, len, def) =>{ // SUBMIT FOR TRAILER EQUIPMENT MODAL
    console.log('DRIVER ADMIN: ADDING', amount, type, len, def)
    onDriverTrailerAdd(currentDriverId, amount, type, len, def)
}


const handleAddEquipmentSubmit = (driverId, type, qty) => { // Function to handle submission of the new modal
    console.log('New Modal Data:',driverId, type, qty);
    onDriverEquipmentAdd(currentDriverId, driverId, type, qty)
    // Handle the new modal data submission
  };

  return (
    <>
    <tr>
      <td colSpan="9">
        <table>
          <thead>
            <tr><th colSpan="6">Drivers:</th></tr>
            <tr>
              <th>Driver Name</th>
              <th>Driver Phone Number</th>
              <th>Current Location</th>
              <th>Available Date</th>
              <th>Trailer Equipment</th>
              <th>Securing Equipment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentDrivers.filter(driver => driver.driverCompany === client._id).map((driver, driverIndex) => (
              <tr key={`driver-${driverIndex}`}>
                {editingDriverIndex.includes(driverIndex) && editingDriverCompany === client._id ? ( //DRIVER EDIT  MODE ON
                  <>
                    <td><input type="text" value={driver.driverName} onChange={(e) => onHandleDriverChange(driver._id, 'driverName', e.target.value)} /></td>
                    <td><input type="text" value={driver.driverPhoneNumber} onChange={(e) => onHandleDriverChange(driver._id, 'driverPhoneNumber', e.target.value)} /></td>
                    <td><input type="text" value={driver.currentLocation} onChange={(e) => onHandleDriverChange(driver._id, 'currentLocation', e.target.value)} /></td>
                    <td><input type="text" value={driver.availableDate} onChange={(e) => onHandleDriverChange(driver._id, 'availableDate', e.target.value)} /></td>
                    <td>
                      {/* <ul>
                        {driver.trailerInfo.filter(trailer => trailer.amount !== null && trailer.amount !== 0).map((trailer, index) => (
                          <li key={index}>{trailer.amount}x {trailer.type} {trailer.length} {trailer.def ? 'Default' : null} <button onClick={(e) =>onDriverTrailerDelete(e, driver._id, trailer.amount, trailer.type, trailer.length)}>Delete</button></li>
                        ))}
                        <li><button onClick={(e)=>handleAddTrailerClick(e, driver._id)}>Add Trailer</button></li>
                      </ul> */}

                    <ul>
                      {driver.trailerInfo.filter(trailer => trailer.amount !== null && trailer.amount !== 0).map((trailer, index) => (
                        <li key={index}>
                          {trailer.amount}x {trailer.type} {trailer.length} 
                          <input type="checkbox" checked={trailer.def} readOnly />
                          <button onClick={(e) => onDriverTrailerDelete(e, driver._id, trailer.amount, trailer.type, trailer.length)}>Delete</button>
                        </li>
                      ))}
                      <li><button onClick={(e) => handleAddTrailerClick(e, driver._id)}>Add Trailer</button></li>
                    </ul>
                    </td>


                    <td>
                        <ul>
                        {driver.selectedEquipment.map((eq, index) => {
                                // console.log('Equipment Type:', eq.type); // Add this line to log the type
                                return (
                                eq.qty > 0 ? (
                                    <li key={index}>
                                    {`${eq.type} qty: ${eq.qty}`} 
                                    <button type='button' onClick={(e) => onDriverEquipmentDelete(e, driver._id, eq.type, eq.qty)}>Delete</button>
                                    </li>
                                ) : null
                                );
                            })}
                            <li>
                                <button onClick={(e) => handleAddEquipmentClick(e, driver._id)}>Add Equipment</button>
                            </li>
                        </ul>        
                    </td>


                    <td>
                      <button type='button' onClick={(e) => onDriverEditSave(e, driverIndex, driver.driverCompany, driver._id)}>Save</button>
                      <button type='button' >Delete</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{driver.driverName}</td>
                    <td>{driver.driverPhoneNumber}</td>
                    <td>{driver.currentLocation}</td>
                    <td>{driver.availableDate}</td>
                    <td>
                      <ul>
                        {driver.trailerInfo.filter(trailer => trailer.amount !== null && trailer.amount !== 0).length > 0 ? (
                          driver.trailerInfo.filter(trailer => trailer.amount !== null && trailer.amount !== 0).map((trailer, index) => (
                            <li key={index}>{trailer.amount}x {trailer.type} {trailer.length}  {trailer.def ? 'Default' : null}</li>
                          ))
                        ) : (
                          <span>No Trailer available, EDIT Driver</span>
                        )}
                      </ul>
                    </td>         

                    <td>
                    <ul>
                        {driver.selectedEquipment.filter(eq => eq.qty > 0).length > 0 ? (
                        driver.selectedEquipment.filter(eq => eq.qty > 0).map((eq, index) => (
                            <li key={index}>{`${eq.type} qty: ${eq.qty}`}</li>
                        ))
                        ) : (
                        <span>No equipment available, EDIT Driver</span>
                        )}
                    </ul>
                    </td>
                    <td>
                      <button type='button' onClick={(e) => onDriverEdit(e, driverIndex, driver.driverCompany)} disabled={editingDriverCompany.length > 0 && editingDriverIndex.length > 0}>Edit</button>
                      <button type='button' onClick={(e) => onDriverDelete(e, driverIndex, driver._id)} disabled={editingDriverCompany.length > 0 && editingDriverIndex.length > 0}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
        <AddTrailerModal 
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            currentDriverId={currentDriverId}
            currentDrivers={currentDrivers}
        />
        <AddEquipmentModal
                    isOpen={isEquipmentModalOpen}
                    onRequestClose={() => setIsEquipmentModalOpen(false)}
                    onSubmit={handleAddEquipmentSubmit}
                    currentDriverId={currentDriverId}
        /> 

    </>
  );
};

export default DriverAdmin;