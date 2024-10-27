import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import './addDriverModal.css'


const AddDriverModal = ({ isOpen, onRequestClose, onSubmit, currentClients,
    
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
  const [trailerArray, setTrailerArray] = useState([])
  const [selectedEquipment, setSelectedEquipment] = useState([])
  const [isDefaultSelected, setIsDefaultSelected] = useState(false)

  const amountRef = useRef();
  const typeRef = useRef();
  const lengthRef = useRef();
  const defaultRef = useRef();
  const formRef = useRef(); //CONTROLS THE FORM TO ADD NEW DRIVER INFO
  const timeoutRef = useRef();/// CONTROLS THE TIMEOUT CLEAN OF ARRAYS AFTER DRIVER ADD



  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Form validation
  //   const otherAmounts = otherTypeTrailerArray.map(trailer => trailer.amount);
  //   const amounts = [
  //     fb48Amount, fb53Amount,
  //     van48Amount, van53Amount,
  //     reefer48Amount, reefer53Amount,
  //     ...otherAmounts
  //   ];
  //   const allAmountsAreZeroOrEmpty = amounts.every(amount => amount === '' || amount === '0');
  //   if (allAmountsAreZeroOrEmpty) {
  //     alert('Please add at least one trailer');
  //     return;
  //   }
  //   const noDefaultTrailerSelected = (
  //     (!fb48Checked && !fb53Checked && !van48Checked && !van53Checked && !reefer48Checked && !reefer53Checked) &&
  //     !otherTypeTrailerArray.some(trailer => trailer.def === true)
  //   );
  //   if (noDefaultTrailerSelected) {
  //     alert('At least one trailer type has to be selected as default');
  //     return;
  //   }
  //   if (selectedCompany === '') {
  //     alert('Please select a company');
  //     return;
  //   }

  //   // Prepare data to send
  //   let newTrailerArray = [...otherTypeTrailerArray, 
  //     { amount: fb48Amount, type: 'flatbed', length: '48', def: fb48Checked },
  //     { amount: fb53Amount, type: 'flatbed', length: '53', def: fb53Checked },
  //     { amount: van48Amount, type: 'van', length: '48', def: van48Checked },
  //     { amount: van53Amount, type: 'van', length: '53', def: van53Checked },
  //     { amount: reefer48Amount, type: 'reefer', length: '48', def: reefer48Checked },
  //     { amount: reefer53Amount, type: 'reefer', length: '53', def: reefer53Checked }
  //   ];

  //   const newSelectedEquipment = {
  //     tarps8ft: tarps8ft,
  //     tarps6ft: tarps6ft,
  //     tarps4ft: tarps4ft,
  //     pipeStakes: pipeStakes,
  //     dunnage: dunnage,
  //     chains: chains,
  //     binders: binders
  //   };
  //   const newSelectedEquipmentArray = Object.entries(newSelectedEquipment).map(([key, value]) => ({
  //     type: key,
  //     qty: value
  //   }));

  //   const dataToSend = {
  //     driverInfo: {
  //       driverName: driverName, 
  //       driverPhoneNumber: driverPhone, 
  //       driverCompany: selectedCompany,
  //       currentLocation: currentLocation,
  //       availableDate: availableDate,
  //       assignedDispatcher: assignedDispatcher,
  //       driverStatus: driverStatus,
  //       driverLog: {comment: `* New Driver "${driverName}" created, dispatcher "${assignedDispatcher}" assigned`}
  //     },
  //     selectedEquipment: newSelectedEquipmentArray,
  //     trailerInfo: newTrailerArray
  //   };

  //   onSubmit(e,dataToSend);
  //   onRequestClose();
  //   resetForm();
  // };

  const onDriverAdd = async(e, driverInfo) =>{ //ADDS A DRIVER, includes: Company Info, Driver info and Equipment info
    console.log('ON DRIVER ADD', driverInfo)
    try {
    

        e.preventDefault();
        clearTimeout(timeoutRef.current);

        const elements = e.target.elements;

        const fb48Amount = elements['fb48-ammount']?.value;
        const fb48Checked = elements['default-fb48']?.checked;
        const fb53Amount = elements['fb53-ammount']?.value;
        const fb53Checked = elements['default-fb53']?.checked;

        const van48Amount = elements['van48-ammount']?.value;
        const van48Checked = elements['default-van48']?.checked;
        const van53Amount = elements['van53-ammount']?.value;
        const van53Checked = elements['default-van53']?.checked;

        const reefer48Amount = elements['reefer48-ammount']?.value;
        const reefer48Checked = elements['default-reefer48']?.checked;
        const reefer53Amount = elements['reefer53-ammount']?.value;
        const reefer53Checked = elements['default-reefer53']?.checked;
    

        //FORM VALIDATION
        const otherAmounts = otherTypeTrailerArray.map(trailer => trailer.amount);
        const amounts = [
            fb48Amount, fb53Amount,
            van48Amount, van53Amount,
            reefer48Amount, reefer53Amount,
            ...otherAmounts
        ];
        console.log(amounts, otherAmounts)
        const allAmountsAreZeroOrEmpty = amounts.every(amount => amount === '' || amount === '0');
        if (allAmountsAreZeroOrEmpty) {
            alert('Please add at least one trailer');
            return;
        }
            const noDefaultTrailerSelected = (
            (!fb48Checked && !fb53Checked && !van48Checked && !van53Checked && !reefer48Checked && !reefer53Checked) &&
            !otherTypeTrailerArray.some(trailer => trailer.def === true)
        );
        if (noDefaultTrailerSelected){
            alert('At least one trailer type has to be selected as default')
            return
        }

        if(selectedCompany === ''){
            alert('Please select a company')
            return
        }
        //FORM VALIDATION

        
        console.log('Values:', {
            fb48Amount, fb48Checked, fb53Amount, fb53Checked,
            van48Amount, van48Checked, van53Amount, van53Checked,
            reefer48Amount, reefer48Checked, reefer53Amount, reefer53Checked
        }, 'OTHER TRAILERS', otherTypeTrailerArray);        


        let newTrailerArray = [...otherTypeTrailerArray, 
            { amount: fb48Amount, type: 'flatbed', length: '48', def: fb48Checked },
            { amount: fb53Amount, type: 'flatbed', length: '53', def: fb53Checked },
            { amount: van48Amount, type: 'van', length: '48', def: van48Checked },
            { amount: van53Amount, type: 'van', length: '53', def: van53Checked },
            { amount: reefer48Amount, type: 'reefer', length: '48', def: reefer48Checked },
            { amount: reefer53Amount, type: 'reefer', length: '53', def: reefer53Checked }
        ];

        const newSelectedEquipment = {//collects all the equipment info
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
        })); //convets equipment info into an array to be received by backed
        // console.log('DRIVER INFO ADD DRIVER MODAL', driverInfo.map((index, element)=>element))
    
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
    
        console.log('PRE SERVER POST', dataToSend)
        const additionCall = await axios.post('http://localhost:3001/driverAdd', dataToSend, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('ADDITION CALL',additionCall);
        if (additionCall){
            toast.success("Driver added successfully");

        }
    

        timeoutRef.current = setTimeout(() => {//RESETS all arrays 1sec after addition
            setTrailerArray([])
            setOtherTypeTrailerArray([]);
            setSelectedEquipment([]);
            setSelectedCompany('');
            setDriverName('');
            setDriverPhone('');
            setIsDefaultSelected(false)
            setAssignedDispatcher('')
            setAvailableDate('')
            setDriverStatus('')


            setFb48Checked(false);
            setFb48Amount('')
            setFb53Checked(false);
            setFb53Amount('')
            setVan48Checked(false);
            setVan48Amount('')
            setVan53Checked(false);
            setVan53Amount('')
            setReefer48Checked(false);
            setReefer48Amount('')
            setReefer53Checked(false);
            setReefer53Amount('')
            setCheckedTrailer(false)
            setTarps8ft('')
            setTarps6ft('')
            setTarps4ft('')
            setChains('')
            setBinders('')
            setPipeStakes('')
            setDunnage('')
            //otherTypeTrailer array gets reset because its local before sending to the DB

            elements['default-fb48'].checked = false;
            elements['default-fb53'].checked = false;
            elements['default-van48'].checked = false;
            elements['default-van53'].checked = false;
            elements['default-reefer48'].checked = false;
            elements['default-reefer53'].checked = false;
            toast.success("Driver added successfully");
            // formRef.current.reset();
            onRequestClose();

        }, 1000);
        
    } catch (err) {
        console.log(err)
    }

}
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
const onOtherTrailerEdit = async (e, index) => {
  console.log('ON OTHER TRAILER EDIT', e, index);
  const item = otherTypeTrailerArray[index];
  console.log(item.defaultTrailer);
  setOttEditingAmount(item.amount);
  setOttEditingType(item.type);
  setOttEditingLenght(item.length);
  setOttEditingDefault(item.def);
  setEditingIndex(index);  // Set the editing index here
};
const handleCheckboxChange = (name) => {
  setCheckedTrailer(name);

  //RESET TO '' ALL VALUES RIGHT AFTER A CLICK
  setFb48Amount("");
  setFb53Amount("");
  setVan48Amount("");
  setVan53Amount("");
  setReefer48Amount("");
  setReefer53Amount("");

  switch (name) {
      case 'default-fb48':
          setFb48Checked(!fb48Checked);
          if (!fb48Checked) setFb48Amount("1");
          break;
      case 'default-fb53':
          setFb53Checked(!fb53Checked);
          if (!fb53Checked) setFb53Amount("1");
          break;
      case 'default-van48':
          setVan48Checked(!van48Checked);
          if (!van48Checked) setVan48Amount("1");
          break;
      case 'default-van53':
          setVan53Checked(!van53Checked);
          if (!van53Checked) setVan53Amount("1");
          break;
      case 'default-reefer48':
          setReefer48Checked(!reefer48Checked);
          if (!reefer48Checked) setReefer48Amount("1");
          break;
      case 'default-reefer53':
          setReefer53Checked(!reefer53Checked);
          if (!reefer53Checked) setReefer53Amount("1");
          break;
      default:
          break;
  }
};

const onOtherTrailerEditSave = async (e, index) => {
  const newOtherTypeTrailerArray = [...otherTypeTrailerArray];
  newOtherTypeTrailerArray[index] = {
      ...newOtherTypeTrailerArray[index],
      amount: ottEditingAmount,  // Ensure the key matches the original state
      type: ottEditingType,
      length: ottEditingLenght,
      def: ottEditingDefault
  };
  setOtherTypeTrailerArray(newOtherTypeTrailerArray);
  setEditingIndex(null);
  setOttEditingAmount('');
  setOttEditingType('');
  setOttEditingLenght('');
  setOttEditingDefault(false);

  console.log('OTT');
  console.log('ON SAVE OTT', newOtherTypeTrailerArray);
};
const onOtherTrailerDelete = async(e, index)=>{//DELETE control for otherTypeTrailers
  console.log('DELETE OOTHER-TYPE TRAILER', e.target, index)
  setOtherTypeTrailerArray(prevState =>{
      let arrayCopy= [...prevState]
      arrayCopy.splice(index, 1)
      return arrayCopy
  })

}
const onDateSetup = async(e, date) =>{ //SETS A DRIVER STATUS BASED ON DATE
  console.log('ON DATE SETUP',e,date)
  try {
      setAvailableDate(e.target.value)
      const today = formatDate(new Date())
      const tomorrow = formatDate(new Date(new Date().setDate(new Date().getDate() + 1)));
      if (date === today) {
          setDriverStatus('urgent')
          console.log('URGENT')
      } else if (date === tomorrow){
          setDriverStatus('not-urgent')
          console.log('NOT URGENT')
      } else{
          setDriverStatus('other-date')
          console.log('OTHER DATE')
      }
      
      // date === formatDate(new Date()) ? console.log('DATE MATCH URGENT') : console.log('NOT MATCHED')
      
  } catch (err) {
      console.log(err)
  }

}
const formatDate = (date) => { //this standarizes the date format for the whole program
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal-content">
      <form ref={formRef}  onSubmit={onDriverAdd}>
        <h3 id='h3'>Add a new Driver</h3>
        <label htmlFor="client">Select a Client:</label>

        <select name="client" id="client" onChange={e => setSelectedCompany(e.target.value)} required>
          <option value="default" ></option>
            {Array.from(currentClients).map((company, index) => {
              return <option key={index} value={company.companyName}>{company.companyName}</option>
          })}    

        </select>
        <label htmlFor="driverName">Driver Name:</label>
                            <input type="text" name='driverName'  onChange={e =>setDriverName(e.target.value)} required placeholder='Driver Name'/>

                            <label htmlFor="driverPhoneNumber">Driver Phone#:</label>
        <input type="text" name='driverPhoneNumber' onChange={e =>setDriverPhone(e.target.value) } required placeholder='xxx - xxx - xxxx' />
        
        <label htmlFor="currentLocation">Current Location:</label>
        <input type="text" name='currentLocation' onChange={e => setCurrentLocation(e.target.value)} required placeholder='Current location' />
        
        <label htmlFor="inactiveDriver">Inactive
        <input type="checkBox" name="inactiveDriver" id="inactiveDriver"  onChange={e => setDriverStatus(e.target.checked ? 'inactive' : null)} />   

        </label>
        <label htmlFor="availableDate">Available Date:      
        <input type="date" name="availableDate" id="" onChange={e => onDateSetup(e, e.target.value)} disabled={driverStatus} required />
        </label>                                          
          
        <label htmlFor="assignedDispatcher">Assigned Dispatcher
            <select id="assignedDispatcher" name="assignedDispatcher" onChange={e => setAssignedDispatcher(e.target.value)}>
                <option value="default">Select a dispatcher:</option>
                <option value="dispatcher1">dispatcher1</option>
                <option value="dispatcher2">dispatcher2</option>
                <option value="dispatcher3">dispatcher3</option>
            </select>     
        </label>

        
        <strong>Trailer Type:</strong>
        <div className='trailerType-fb'>
          <input type="text" className='equipmentOption-trailerType' name='fb48-ammount' onChange={e => setFb48Amount(e.target.value)} value={fb48Amount} />
          <label htmlFor="fb48-ammount">xFB48 default?</label>
          <input type="checkbox" id='fb48' name='default-fb48' checked={checkedTrailer === 'default-fb48'} onChange={() => handleCheckboxChange('default-fb48') } />

          <input type="text" className='equipmentOption-trailerType' name='fb53-ammount' onChange={e => setFb53Amount(e.target.value)} value={fb53Amount} />
          <label htmlFor="fb53-ammount">xFB53 default?</label>
          <input type="checkbox" id='fb53' name='default-fb53' checked={checkedTrailer === 'default-fb53'} onChange={() => handleCheckboxChange('default-fb53')} />
      </div>

      <div className='trailerType-van'>
          <input type="text" className='equipmentOption-trailerType' name='van48-ammount' onChange={e => setVan48Amount(e.target.value)} value={van48Amount}/>
          <label htmlFor="van48-ammount">xV48 default?</label>
          <input type="checkbox" id='van48' name='default-van48' checked={checkedTrailer === 'default-van48'} onChange={() => handleCheckboxChange('default-van48')} />

          <input type="text" className='equipmentOption-trailerType' name='van53-ammount' onChange={e => setVan53Amount(e.target.value)}  value={van53Amount}/>
          <label htmlFor="van53-ammount">xV53 default?</label>
          <input type="checkbox" id='van53' name='default-van53' checked={checkedTrailer === 'default-van53'} onChange={() => handleCheckboxChange('default-van53')} />
      </div>

      <div className='trailerType-reefer'>
          <input type="text" className='equipmentOption-trailerType' name='reefer48-ammount' onChange={e => setReefer48Amount(e.target.value)} value={reefer48Amount} />
          <label htmlFor="reefer48-ammount">xR48 default?</label>
          <input type="checkbox" id='reefer48' name='default-reefer48' checked={checkedTrailer === 'default-reefer48'} onChange={() => handleCheckboxChange('default-reefer48')} />

          <input type="text" className='equipmentOption-trailerType' name='reefer53-ammount' onChange={e => setReefer53Amount(e.target.value)}  value={reefer53Amount}/>
          <label htmlFor="reefer53-ammount">xR53 default?</label>
          <input type="checkbox" id='reefer53' name='default-reefer53' checked={checkedTrailer === 'default-reefer53'} onChange={() => handleCheckboxChange('default-reefer53')} />
      </div>

        
        <div className='trailerType-other'>
              <button type='button' onClick={() => setOtherTypeOfTrailerSelected(true)} disabled={otherTypeOfTrailerSelected === true}>+Other Type Trailer</button>

              <div className='trailerType-other-form'>
              {otherTypeOfTrailerSelected === true &&
                  <div className='other-trailerType'>
                  <h5>Add a new Other-Type trailer:</h5>

                  <input type="text" name='amount' className='other-trailerType-amount' ref={amountRef}  required/>
                  <label htmlFor="amount">x</label>

                  <label htmlFor="type">Type</label>
                  <input type="text" name='type' className='other-trailerType-type' ref={typeRef}  required/>
                  <br />

                  <label htmlFor="length">Length</label>
                  <input type="text" name='length' className='other-trailerType-length' ref={lengthRef}  required/>
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
                          <input type="checkbox" name='editedDefault' checked={ottEditingDefault && checkedTrailer === 'editedDefault'  } onChange={(e) => (setOttEditingDefault(e.target.checked ), handleCheckboxChange('editedDefault'))} />
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
      <ToastContainer/>
    </Modal>
  );
};

export default AddDriverModal;