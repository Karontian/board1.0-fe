import React, { useState, useRef } from 'react';
import Modal from 'react-modal';

const AddDriverModal = ({ isOpen, onRequestClose, onSubmit, currentClients,
    onOtherTrailerDelete, onOtherTrailerEdit, onOtherTrailerEditSave, handleCheckboxChange
 }) => {
  const [fb48Checked, setFb48Checked] = useState(false);
  const [fb48Amount, setFb48Amount] = useState("");
  const [fb53Checked, setFb53Checked] = useState(false);
  const [fb53Amount, setFb53Amount] = useState("");
  const [van48Checked, setVan48Checked] = useState(false);
  const [van48Amount, setVan48Amount] = useState("");
  const [van53Checked, setVan53Checked] = useState(false);
  const [van53Amount, setVan53Amount] = useState("");
  const [reefer48Checked, setReefer48Checked] = useState(false);
  const [reefer48Amount, setReefer48Amount] = useState("");
  const [reefer53Checked, setReefer53Checked] = useState(false);
  const [reefer53Amount, setReefer53Amount] = useState("");
  const [checkedTrailer, setCheckedTrailer] = useState(null); // TRACKS WHAT TRAILER GETS TO BE DEFAULT AT THE EQUIPMENT ADD SECTION

  const [tarps8ft, setTarps8ft] = useState('');
  const [tarps6ft, setTarps6ft] = useState('');
  const [tarps4ft, setTarps4ft] = useState('');
  const [chains, setChains] = useState('');
  const [binders, setBinders] = useState('');
  const [pipeStakes, setPipeStakes] = useState('');
  const [dunnage, setDunnage] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [availableDate, setAvailableDate] = useState('');
  const [assignedDispatcher, setAssignedDispatcher] = useState('');
  const [driverStatus, setDriverStatus] = useState('');
  const [otherTypeTrailerArray, setOtherTypeTrailerArray] = useState([]);
  const [otherTypeOfTrailerSelected, setOtherTypeOfTrailerSelected] = useState(false)//Selection of other Trailer type
  const [editingIndex, setEditingIndex] = useState(false)
  const [ottEditingType, setOttEditingType] = useState('')//hold the type value on edition
  const [ottEditingAmount, setOttEditingAmount] = useState('')//holds the amount value on edition
  const [ottEditingLenght, setOttEditingLenght] = useState('')// lenght value
  const [ottEditingDefault, setOttEditingDefault] = useState(false)//default value

  const amountRef = useRef();
  const typeRef = useRef();
  const lengthRef = useRef();
  const defaultRef = useRef();
  const formRef = useRef(); //CONTROLS THE FORM TO ADD NEW DRIVER INFO
  const timeoutRef = useRef();/// CONTROLS THE TIMEOUT CLEAN OF ARRAYS AFTER DRIVER ADD



  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const otherAmounts = otherTypeTrailerArray.map(trailer => trailer.amount);
    const amounts = [
      fb48Amount, fb53Amount,
      van48Amount, van53Amount,
      reefer48Amount, reefer53Amount,
      ...otherAmounts
    ];
    const allAmountsAreZeroOrEmpty = amounts.every(amount => amount === '' || amount === '0');
    if (allAmountsAreZeroOrEmpty) {
      alert('Please add at least one trailer');
      return;
    }
    const noDefaultTrailerSelected = (
      (!fb48Checked && !fb53Checked && !van48Checked && !van53Checked && !reefer48Checked && !reefer53Checked) &&
      !otherTypeTrailerArray.some(trailer => trailer.def === true)
    );
    if (noDefaultTrailerSelected) {
      alert('At least one trailer type has to be selected as default');
      return;
    }
    if (selectedCompany === '') {
      alert('Please select a company');
      return;
    }

    // Prepare data to send
    let newTrailerArray = [...otherTypeTrailerArray, 
      { amount: fb48Amount, type: 'flatbed', length: '48', def: fb48Checked },
      { amount: fb53Amount, type: 'flatbed', length: '53', def: fb53Checked },
      { amount: van48Amount, type: 'van', length: '48', def: van48Checked },
      { amount: van53Amount, type: 'van', length: '53', def: van53Checked },
      { amount: reefer48Amount, type: 'reefer', length: '48', def: reefer48Checked },
      { amount: reefer53Amount, type: 'reefer', length: '53', def: reefer53Checked }
    ];

    const newSelectedEquipment = {
      tarps8ft: tarps8ft,
      tarps6ft: tarps6ft,
      tarps4ft: tarps4ft,
      pipeStakes: pipeStakes,
      dunnage: dunnage,
      chains: chains,
      binders: binders
    };
    const newSelectedEquipmentArray = Object.entries(newSelectedEquipment).map(([key, value]) => ({
      type: key,
      qty: value
    }));

    const dataToSend = {
      driverInfo: {
        driverName: driverName, 
        driverPhoneNumber: driverPhone, 
        driverCompany: selectedCompany,
        currentLocation: currentLocation,
        availableDate: availableDate,
        assignedDispatcher: assignedDispatcher,
        driverStatus: driverStatus,
        driverLog: {comment: `* New Driver "${driverName}" created, dispatcher "${assignedDispatcher}" assigned`}
      },
      selectedEquipment: newSelectedEquipmentArray,
      trailerInfo: newTrailerArray
    };

    onSubmit(e,dataToSend);
    onRequestClose();
    resetForm();
  };

  const resetForm = () => {
    setFb48Checked(false);
    setFb48Amount("");
    setFb53Checked(false);
    setFb53Amount("");
    setVan48Checked(false);
    setVan48Amount("");
    setVan53Checked(false);
    setVan53Amount("");
    setReefer48Checked(false);
    setReefer48Amount("");
    setReefer53Checked(false);
    setReefer53Amount("");
    setOtherTypeTrailerArray([]);
    setTarps8ft('');
    setTarps6ft('');
    setTarps4ft('');
    setChains('');
    setBinders('');
    setPipeStakes('');
    setDunnage('');
    setSelectedCompany('');
    setDriverName('');
    setDriverPhone('');
    setCurrentLocation('');
    setAvailableDate('');
    setAssignedDispatcher('');
    setDriverStatus('');
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onRequestClose();
    otherTypeOfTrailerSelected(false)
    resetForm();
  };

  const onCancelOtherTrailers = async(e,index)=>{//TOGGLE control for cancel action
    setOtherTypeOfTrailerSelected(false)
}

const onSaveOtherTypeTrailer = async(e)=>{//TOGGLE control for other Type trailer && otherTypeTrailer array ADDITION
    console.log('OTHER TYPE TRAILERS FROM BOARD ADMIN')
    
    try {
        let amount = amountRef.current.value
        let type = typeRef.current.value
        let length = lengthRef.current.value
        let def = defaultRef.current.checked
        
        switch (true) {
            case (amount === 0 || amount === ''):
                alert('Please add a trailer amount');
                return;
            case (type === ''):
                alert('Please add a trailer name or type');
                return;
            case (length === ''):
                alert('Please add a trailer length');
                return;
           
        }
        console.log('DEFAULT T', def)
        setOtherTypeTrailerArray(prev => [...prev, { amount, type, length, def }]);                
        setOtherTypeOfTrailerSelected(false)
        setOttEditingAmount(amount)
        setOttEditingLenght(length)
        setOttEditingType(type)
        setOttEditingDefault(def)
    } catch (err) {
        console.log(err)
    }
    
}
  
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Add a New Driver</h2>
      <form onSubmit={handleSubmit}>
    
        <label htmlFor="client">Select a Client:</label>
        <select name="client" id="client" onChange={e => setSelectedCompany(e.target.value)} required>
          <option value="default"></option>
          {Array.from(currentClients).map((company, index) => {
            return <option key={index} value={company.companyName}>{company.companyName}</option>
          })}
        </select>
        <label>
          Driver Name:
          <input
            type="text"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="Enter driver name"
            required
          />
        </label>
        <label>
          Driver Phone:
          <input
            type="text"
            value={driverPhone}
            onChange={(e) => setDriverPhone(e.target.value)}
            placeholder="Enter driver phone"
            required
          />
        </label>
        <label>
          Current Location:
          <input
            type="text"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            placeholder="Enter current location"
            required
          />
        </label>
        <label>
          Available Date:
          <input
            type="date"
            value={availableDate}
            onChange={(e) => setAvailableDate(e.target.value)}
            required
          />
        </label>
        <label>
          Assigned Dispatcher:
          <input
            type="text"
            value={assignedDispatcher}
            onChange={(e) => setAssignedDispatcher(e.target.value)}
            placeholder="Enter assigned dispatcher"
            required
          />
        </label>
        <label>
          Driver Status:
          <input
            type="text"
            value={driverStatus}
            onChange={(e) => setDriverStatus(e.target.value)}
            placeholder="Enter driver status"
            required
          />
        </label>
        <h3>Trailer Information</h3>
        <label>
          Flatbed 48:
          <input
            type="number"
            value={fb48Amount}
            onChange={(e) => setFb48Amount(e.target.value)}
            placeholder="Amount"
          />
          <input
            type="checkbox"
            checked={fb48Checked}
            onChange={(e) => setFb48Checked(e.target.checked)}
          />
          Default
        </label>
        <label>
          Flatbed 53:
          <input
            type="number"
            value={fb53Amount}
            onChange={(e) => setFb53Amount(e.target.value)}
            placeholder="Amount"
          />
          <input
            type="checkbox"
            checked={fb53Checked}
            onChange={(e) => setFb53Checked(e.target.checked)}
          />
          Default
        </label>
        <label>
          Van 48:
          <input
            type="number"
            value={van48Amount}
            onChange={(e) => setVan48Amount(e.target.value)}
            placeholder="Amount"
          />
          <input
            type="checkbox"
            checked={van48Checked}
            onChange={(e) => setVan48Checked(e.target.checked)}
          />
          Default
        </label>
        <label>
          Van 53:
          <input
            type="number"
            value={van53Amount}
            onChange={(e) => setVan53Amount(e.target.value)}
            placeholder="Amount"
          />
          <input
            type="checkbox"
            checked={van53Checked}
            onChange={(e) => setVan53Checked(e.target.checked)}
          />
          Default
        </label>
        <label>
          Reefer 48:
          <input
            type="number"
            value={reefer48Amount}
            onChange={(e) => setReefer48Amount(e.target.value)}
            placeholder="Amount"
          />
          <input
            type="checkbox"
            checked={reefer48Checked}
            onChange={(e) => setReefer48Checked(e.target.checked)}
          />
          Default
        </label>
        <label>
          Reefer 53:
          <input
            type="number"
            value={reefer53Amount}
            onChange={(e) => setReefer53Amount(e.target.value)}
            placeholder="Amount"
          />
          <input
            type="checkbox"
            checked={reefer53Checked}
            onChange={(e) => setReefer53Checked(e.target.checked)}
          />
          Default
        </label>

        <div className='trailerType-other'>
          <button type='button' onClick={() => setOtherTypeOfTrailerSelected(true)} disabled={otherTypeOfTrailerSelected === true}>+Other Type Trailer</button>

          <div className='trailerType-other-form'>
            {otherTypeOfTrailerSelected === true &&
              <div className='other-trailerType'>
                <h5>Add a new Other-Type trailer:</h5>

                <input type="text" name='amount' className='other-trailerType-amount' ref={amountRef} required />
                <label htmlFor="amount">x</label>

                <label htmlFor="type">Type</label>
                <input type="text" name='type' className='other-trailerType-type' ref={typeRef} required />
                <br />

                <label htmlFor="length">Length</label>
                <input type="text" name='length' className='other-trailerType-length' ref={lengthRef} required />
                <span>ft</span>

                <label htmlFor="default">Default?</label>
                <input type="checkbox" name='default' className='other-trailerType' ref={defaultRef} checked={checkedTrailer === 'default-other'} onChange={() => handleCheckboxChange('default-other')} />

                <button type='button' onClick={(e) => onSaveOtherTypeTrailer(e)}>Save Trailers</button>
                <button type='button' onClick={(e) => onCancelOtherTrailers(e)}>Cancel</button>
              </div>
            }
          </div>

          <div className='trailerType-other-grid'>
            <h3>Other-Type Trailers added:</h3>
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Trailer Type</th>
                  <th>Trailer Length</th>
                  <th>Default?</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {otherTypeTrailerArray.map((item, index) => (
                  editingIndex === index ? ( // EDITING MODE
                    <tr key={index}>
                      <td>
                        <label htmlFor="editedAmount"></label>
                        <input type="text" name='editedAmount' value={ottEditingAmount} onChange={(e) => setOttEditingAmount(e.target.value)} />
                      </td>
                      <td>
                        <label htmlFor="editedType"></label>
                        <input type="text" name='editedType' value={ottEditingType} onChange={(e) => setOttEditingType(e.target.value)} />
                      </td>
                      <td>
                        <label htmlFor="editedLength"></label>
                        <input type="text" name='editedLength' value={ottEditingLenght} onChange={(e) => setOttEditingLenght(e.target.value)} />
                      </td>
                      <td>
                        <input type="checkbox" name='editedDefault' checked={ottEditingDefault && checkedTrailer === 'editedDefault'} onChange={(e) => (setOttEditingDefault(e.target.checked), handleCheckboxChange('editedDefault'))} />
                      </td>
                      <td>
                        <button type='button' onClick={(e) => onOtherTrailerEditSave(e, index)}>Save</button>
                        <button type='button'>Cancel</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td>{item.amount}</td>
                      <td>{item.type}</td>
                      <td>{item.length}</td>
                      <td>
                        <label htmlFor="defaultTrailer"></label>
                        <input type="checkbox" name='defaultTrailer' checked={item.def} readOnly />
                      </td>
                      <td>
                        <button type='button' onClick={(e) => onOtherTrailerDelete(e, index)}>Delete</button>
                        <button type='button' onClick={(e) => onOtherTrailerEdit(e, index)}>Edit</button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
              <tfoot>
              </tfoot>
            </table>
          </div>
        </div>

        <button type="submit">Add</button>
        <button type="button" onClick={onRequestClose}>Cancel</button>




        <h3>Equipment Information</h3>
        <label>
          Tarps 8ft:
          <input
            type="number"
            value={tarps8ft}
            onChange={(e) => setTarps8ft(e.target.value)}
            placeholder="Amount"
          />
        </label>
        <label>
          Tarps 6ft:
          <input
            type="number"
            value={tarps6ft}
            onChange={(e) => setTarps6ft(e.target.value)}
            placeholder="Amount"
          />
        </label>
        <label>
          Tarps 4ft:
          <input
            type="number"
            value={tarps4ft}
            onChange={(e) => setTarps4ft(e.target.value)}
            placeholder="Amount"
          />
        </label>
        <label>
          Chains:
          <input
            type="number"
            value={chains}
            onChange={(e) => setChains(e.target.value)}
            placeholder="Amount"
          />
        </label>
        <label>
          Binders:
          <input
            type="number"
            value={binders}
            onChange={(e) => setBinders(e.target.value)}
            placeholder="Amount"
          />
        </label>
        <label>
          Pipe Stakes:
          <input
            type="number"
            value={pipeStakes}
            onChange={(e) => setPipeStakes(e.target.value)}
            placeholder="Amount"
          />
        </label>
        <label>
          Dunnage:
          <input
            type="number"
            value={dunnage}
            onChange={(e) => setDunnage(e.target.value)}
            placeholder="Amount"
          />
        </label>
        <button type="submit">Add Driver</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </Modal>
  );
};

export default AddDriverModal;