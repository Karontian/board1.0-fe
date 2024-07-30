import React, {useState} from 'react';
import AddTrailerModal from './addTrailerModal';

const DriverAdmin = ({
  client,
  currentDrivers,
  editingDriverIndex,
  editingDriverCompany,
  onHandleDriverChange,
  onDriverEditSave,
  onDriverEdit,
  onDriverDelete,
  onDriverTrailerDelete,
  onDriverTrailerAdd
}) => {

const [isModalOpen, setIsModalOpen] = useState(false)
const [currentDriverId, setCurrentDriverId] = useState('')

const handleAddTrailerClick = (e, driverId) =>{ //OPENS THE MODAL
    console.log('DRIVER ADDMING OPENING MODAL', e, driverId)
    setCurrentDriverId(driverId)
    setIsModalOpen(true)
}

const handleModalSubmit = (amount,  type, len, def) =>{
    console.log('DRIVER ADMIN: ADDING', amount, type, len, def)
    onDriverTrailerAdd(currentDriverId, amount, type, len, def)
}

console.log('CURRENT DRIVERS', currentDrivers)
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
                {editingDriverIndex.includes(driverIndex) && editingDriverCompany === client._id ? (
                  <>
                    <td><input type="text" value={driver.driverName} onChange={(e) => onHandleDriverChange(driver._id, 'driverName', e.target.value)} /></td>
                    <td><input type="text" value={driver.driverPhoneNumber} onChange={(e) => onHandleDriverChange(driver._id, 'driverPhoneNumber', e.target.value)} /></td>
                    <td><input type="text" value={driver.currentLocation} onChange={(e) => onHandleDriverChange(driver._id, 'currentLocation', e.target.value)} /></td>
                    <td><input type="text" value={driver.availableDate} onChange={(e) => onHandleDriverChange(driver._id, 'availableDate', e.target.value)} /></td>
                    <td>
                      <ul>
                        {driver.trailerInfo.filter(trailer => trailer.amount !== null && trailer.amount !== 0).map((trailer, index) => (
                          <li key={index}>{trailer.amount}x {trailer.type} {trailer.length} {trailer.def ? 'Default' : null} <button onClick={(e) =>onDriverTrailerDelete(e, driver._id, trailer.amount, trailer.type, trailer.length)}>Delete</button></li>
                        ))}
                        <li><button onClick={(e)=>handleAddTrailerClick(e, driver._id)}>Add Trailer</button></li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        {driver.selectedEquipment.map((eq, index) => (
                          eq.qty > 0 ? <li key={index}>{`${eq.type} qty: ${eq.qty}`}</li> : null
                        ))}
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
                          <span>No Trailer Available</span>
                        )}
                      </ul>
                    </td>
                    <td>
                      <ul>
                        {driver.selectedEquipment.map((eq, index) => (
                          eq.qty > 0 ? <li key={index}>{`${eq.type} qty: ${eq.qty}`}</li> : null
                        ))}
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
      />

    </>
  );
};

export default DriverAdmin;