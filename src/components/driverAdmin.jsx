import React from 'react';

const DriverAdmin = ({
  client,
  currentDrivers,
  editingDriverIndex,
  editingDriverCompany,
  onHandleDriverChange,
  onDriverEditSave,
  onDriverEdit,
  onDriverDelete
}) => {
  return (
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
                          <li key={index}>{trailer.amount}x {trailer.type} {trailer.length} <button>Delete</button></li>
                        ))}
                        <li><button>Add Trailer</button></li>
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
                      <button type='button'>Delete</button>
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
                            <li key={index}>{trailer.amount}x {trailer.type} {trailer.length}</li>
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
  );
};

export default DriverAdmin;