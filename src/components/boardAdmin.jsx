import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './boardAdmin.css'
import DriverAdmin from './driverAdmin'
import ConfirmationModal from './confirmationModal'
import './ConfirmationModal.css'; // Import the CSS file for styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BoardAdmin  = () =>{
    //COMPANY INFO STATE
    const [companyName, setCompanyName] = useState('')
    const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerPhoneNumber, setOwnwerPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [mcNumber, setMcNumber] = useState('');
    const [dotNumber, setDotNumber] = useState('');
    const [einNumber, setEinNumber] = useState('');
    const [currentClients, setCurrentClients] = useState('');
    const [editingCompanyIndex, setEditingCompanyIndex] = useState(null);

    //TRAILER TYPE STATE
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
    const [trailerArray, setTrailerArray] = useState([])

    //OTHER-TYPE TRAILER STATE AND CRUD
    const [otherTypeOfTrailerSelected, setOtherTypeOfTrailerSelected] = useState(false)//Selection of other Trailer type
    const [otherTypeTrailerArray, setOtherTypeTrailerArray] = useState([])
    const [editingIndex, setEditingIndex] = useState(false)
    const [ottEditingType, setOttEditingType] = useState('')//hold the type value on edition
    const [ottEditingAmount, setOttEditingAmount] = useState('')//holds the amount value on edition
    const [ottEditingLenght, setOttEditingLenght] = useState('')// lenght value
    const [ottEditingDefault, setOttEditingDefault] = useState(false)//default value

    //EQUIPMENT TYPE STATE
    const [tarps8ft, setTarps8ft] = useState(null)
    const [tarps6ft, setTarps6ft] = useState(null)
    const [tarps4ft, setTarps4ft] = useState(null)
    const [chains, setChains] = useState(null)
    const [binders, setBinders] = useState(null)
    const [pipeStakes, setPipeStakes] = useState(null)
    const [dunnage, setDunnage] = useState(null)

    //DRIVER STATE
    const [selectedCompany, setSelectedCompany] = useState('')
    const [driverName, setDriverName] = useState('')
    const [driverPhone, setDriverPhone] = useState('')
    const [selectedEquipment, setSelectedEquipment] = useState([])
    const [currentDrivers,  setCurrentDrivers] = useState([])
    const [currentLocation, setCurrentLocation] = useState('')
    const [availableDate, setAvailableDate] = useState('')
    const [editingDriverIndex, setEditingDriverIndex] = useState([]) //TOGGLES A DRIVER ON EDITION
    const [editingDriverCompany, setEditingDriverCompany] = useState([]) //IDENTIFIES WHAT COMPANY IS THE EDITING DRIVER UNDER
    const [isDefaultSelected, setIsDefaultSelected] = useState(false)
    const [checkedTrailer, setCheckedTrailer] = useState(null); // TRACKS WHAT TRAILER GETS TO BE DEFAULT AT THE EQUIPMENT ADD SECTION
    const [assignedDispatcher, setAssignedDispatcher] = useState('')
    const [driverStatus, setDriverStatus] = useState('')//tracks the driver's status
    const [companyToastId, setCompanyToastId] = useState(null);
    const [driverToastId, setDriverToastId] = useState(null);

    //DELETE CONFIRMATION MODAL
    const [showModal, setShowModal] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState({});
    
    //ADDITION CONFIRMATION MODAL
    

    //DATA REFS
        ///OTHER TRAILER TYPE DATA HOLDERS
    const amountRef = useRef();
    const typeRef = useRef();
    const lengthRef = useRef();
    const defaultRef = useRef();
    const formRef = useRef(); //CONTROLS THE FORM TO ADD NEW DRIVER INFO
    const timeoutRef = useRef();/// CONTROLS THE TIMEOUT CLEAN OF ARRAYS AFTER DRIVER ADD

    
//// FIX THIS IF NETLIFY DOES NOT SUPPORT SERVER PUSHED UPDATES

    useEffect(() => {//MONITORS Server changes && OtherTypeTrailer array
        getClients()
        getDrivers()
        const driverEventSource = new EventSource('http://localhost:3001/driverUpdates');
        const clientEventSource = new EventSource('http://localhost:3001/clientUpdates');
            
        driverEventSource.onmessage = (event) => {
            const drivers = JSON.parse(event.data);
            setCurrentDrivers(drivers)
        };
        
        clientEventSource.onmessage = (event) => {
            const clients = JSON.parse(event.data);
            setCurrentClients(clients)
        };

        if (otherTypeTrailerArray.length === 0) {// RESETS the addDriver form on change to 0 of otherTrypeTrailer array
            formRef.current.reset();
            
        }
    
        return () => {
            driverEventSource.close();
            clientEventSource.close();
        };
    }, [otherTypeTrailerArray]);

    const getClients = async()=>{//FETCH added clients
        try {
            let response =  await axios.get('http://localhost:3001/getClients')
            let clients = response.data.clients
            // console.log('GET CLIENTS RESPONSE', clients)
            setCurrentClients(clients)
        } catch (error) {
            console.log(error)
        }
    }
    const getDrivers = async()=>{
        try {
            let response = await axios.get(`http://localhost:3001/getDrivers`)
            // console.log('GET DRIVERS RESPONSE', response)
            setCurrentDrivers(response.data.drivers)
        } catch (err) {
            console.log(err)
        }
    }//FETCH added drivers

//// FIX THIS IF NETLIFY DOES NOT SUPPORT SERVER PUSHED UPDATES

    //COMPANY CRUD CONTRLS 
    const onCompanySubmit = async(e) =>{//ADDS A COMPANY
        e.preventDefault()
        // console.log('COMPANY ADD')

        try{
            const newCompany = {
                companyName: companyName,
                ownerName: ownerName,
                ownerPhoneNumber: ownerPhoneNumber,
                companyPhoneNumber: companyPhoneNumber,
                address: address,
                mcNumber: mcNumber,
                dotNumber: dotNumber,
                einNumber: einNumber,
            
            }

            const existingCompany = currentClients.find(company => company.companyName === newCompany.companyName);
            if (existingCompany) {
                alert('There is already a company with the same name');
                return; // Exit the function if the company already exists
            }

            const addition = await axios.post('http://localhost:3001/newCompany', newCompany)
            if (addition) {
               const companyToast=  toast.success("New company added successfully", {
                    autoClose: 500, // Duration in milliseconds (5000ms = 5 seconds)
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });              

            }

        }catch(err){
            console.log(err)
        }
        e.target.reset()
    }
    const onCompanyDelete = async(index)=>{//DELETES A COMPANY
        console.log('DELETING COMPANY',index)
        try {
            const req = await axios.delete(`http://localhost:3001/deleteCompany/${index}`)
            console.log(req)
        } catch (err) {
            console.log(err)
        }
    }
    const handleDeleteClick = (e, index, companyName) => { //OPENS DELETE COMPANY CONFIRMATION MODAL
        console.log('DELETING')
        setDeleteInfo({ index, companyName });
        setShowModal(true);
    };
    const handleConfirmDelete = () => { //CONFIRMS COMPANY DELETION IN THE MODAL AND CALLS DELETE FUNCTION
        onCompanyDelete(deleteInfo.index);
        setShowModal(false);
    };
    const handleCancelDelete = () => {//CANCELS COMPANY  DELETION
        setShowModal(false);
    };
    const onCompanyEdit = async(e, index)=>{// TOGGLES COMPANY EDIT MODE
        console.log('COMPANY EDIT', e, index)
        setEditingCompanyIndex(index)        
    }
    const handleClientChange = (index, field, value) => {    // Handler to update client information
        console.log('handle change')
        const updatedClients = currentClients.map((client, clientIndex) => {   // Create a new array with updated client information
        if (index === clientIndex) {
        return { ...client, [field]: value };
      }
      return client;
    });
    setCurrentClients(updatedClients);// Update the state with the new clients array

    };
    const onCompanyEditSave = async (e, index, companyId) => {
    console.log('COMPANY EDIT SAVE', e, index);
    try {
        // Find the client by index in the currentClients array
        const clientToSave = currentClients[index];
        if (!clientToSave) {
            console.error('Client not found');
            return;
        }

        // Use the client's information for the update
        const updatedInformation = {
            companyId: clientToSave._id, // Assuming _id is the field for companyId
            companyName: clientToSave.companyName,
            companyPhoneNumber: clientToSave.companyPhoneNumber,
            ownerName: clientToSave.ownerName,
            ownerPhoneNumber: clientToSave.ownerPhoneNumber,
            address: clientToSave.address,
            mcNumber: clientToSave.mcNumber,
            dotNumber: clientToSave.dotNumber,
            einNumber: clientToSave.einNumber
        };

        const edition = await axios.put(`http://localhost:3001/companyEdit/${companyId}`, updatedInformation);
        console.log(edition);
        setEditingCompanyIndex('');
    } catch (err) {
        console.log(err);
    }
    };
    const onCompanyEditCancel = async(e, index)=>{//CANCEL EDITION MODE
        console.log('ON COMPANY EDIT CANCEL', e, index)
        setEditingCompanyIndex('')
    }

    //DRIVER CRUD CONTROLS
    const onDriverAdd = async(e) =>{ //ADDS A DRIVER, includes: Company Info, Driver info and Equipment info
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
    
            console.log('SELECTED COMPANY', selectedCompany)
        
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
                //otherTypeTrailer array gets reset because its local before sending to the DB

                elements['default-fb48'].checked = false;
                elements['default-fb53'].checked = false;
                elements['default-van48'].checked = false;
                elements['default-van53'].checked = false;
                elements['default-reefer48'].checked = false;
                elements['default-reefer53'].checked = false;
    
            }, 1000);
            
        } catch (err) {
            console.log(err)
        }

    }
    const onDriverAddCancel = async(e)=>{//CANCELS A DRIIVER ADDITION
        console.log('CANCEL ADDITION')
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

    }
    const onDriverEdit = async(e, index, company)=>{ // EDITS A DRIVER ONCE IN DISPLAY
        console.log('EDITING DRIVER', e, index, company)
        try {
        setEditingDriverCompany(company)    
                // Toggle editing state for the selected driver
        setEditingDriverIndex(prev => {
        if (prev.includes(index)) {
            // If already in editing mode, remove from the list to cancel editing
            return prev.filter(i => i !== index);
        } else {
            // Add to the editing list to enable editing
            return [...prev, index];
        }
    });

        } catch (e) {
            console.log(e)
        }
    }
    const onDriverEditSave = async(e, index, company, driverId)=>{// SAVES EDITED INFORMATION BACK TO THE DB
        console.log('ON EDIT SAVE', e.target, index, company, driverId)
        try {
            const driverToSave = currentDrivers.find(driver => driver._id === driverId);
            if (!driverToSave) {
                console.error('Driver not found');
                return;
            }
            console.log('NEW DRIVER INFORMATION', driverToSave)
            const updatedDriverInformation = {
                driverId: driverToSave._id, // Assuming _id is the field for driverId
                driverName: driverToSave.driverName,
                driverPhoneNumber: driverToSave.driverPhoneNumber,
                driverCompany: driverToSave.driverCompany,
                currentLocation: driverToSave.currentLocation,
                availableDate: driverToSave.availableDate
            };
    
            const edition = await axios.put(`http://localhost:3001/driverEditSave/${driverId}`, updatedDriverInformation);
            console.log(edition);
    

            setEditingDriverCompany([]) 
            setEditingDriverIndex([])   
                // Toggle

        } catch (err) {
            console.log(err)
        }
    } 
    const onHandleDriverChange = async(driverId,  field, value) => {//CONTROLS THE CHANGE IN INPUT FOR  THE DRIVER CRUD
        // Find the index of the driver being edited
        const driverIndex = currentDrivers.findIndex(driver => driver._id === driverId);
        if (driverIndex !== -1) {
          // Create a new copy of the currentDrivers array
          const newDrivers = [...currentDrivers];
          // Update the specific field for the found driver
          newDrivers[driverIndex] = { ...newDrivers[driverIndex], [field]: value };
          // Update the state with the new drivers array
          setCurrentDrivers(newDrivers); // Assuming setCurrentDrivers is your state updater function
        }
    };
    const onDriverDelete = async(_id)=>{//DELETES A DRIVER FROM MAIN DRIVER DISPLAY
        console.log('ON DRIVER DELETE', _id)
        try {
            const driverToDelete = _id
            const deletion = await axios.delete(`http://localhost:3001/driverDelete/${driverToDelete}`)
            console.log(deletion)
        } catch (err) {
            console.log(err)
        }
    }
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
                setDriverStatus('notUrgent')
                console.log('NOT URGENT')
            } else{
                setDriverStatus('otherDate')
                console.log('OTHER DATE')
            }
            
            // date === formatDate(new Date()) ? console.log('DATE MATCH URGENT') : console.log('NOT MATCHED')
            
        } catch (err) {
            console.log(err)
        }

    }


    //TRAILER CRUD INFORMATION
    const onDriverTrailerDelete = async(e, driverId, amount, type, len)=>{//DELETES A TRAILER  FROM DRIVER DISPLAY
        try {
         
            console.log('onDriverTrailerDelete', e, driverId, amount, type, len);
            const driverToEdit = currentDrivers.find((driver) => driver._id === driverId);
            console.log(driverToEdit);
            if (!driverToEdit) {
                throw new Error('Driver not found');
            }
            const trailerToDelete = {
                amount,
                type,
                len
            };
            const edition = await axios.put(`http://localhost:3001/driverTrailerDelete/${driverToEdit._id}`, trailerToDelete);
            console.log('Edition response:', edition);


        } catch (e) {
            console.log(e)
        }   
    }

    const onDriverTrailerAdd = async(driverId, amount, type, len, def)=>{ //ADDS A TRAILER  FROM DRIVER DISPLAY
        console.log('DRIVER EDIT TRAILER ADD',driverId, amount, type, len, def) 

        try {
            // console.log('CURRENT DRIVERS @ MODAL', currentDrivers)
            const updateInfo = {
                amount,
                type,
                len,
                def
            }

            const update = await axios.put(`http://localhost:3001/driverTrailerAdd/${driverId}`, updateInfo)
            console.log(update)

        } catch (err) {
            console.log(err)
        }
    }

    const onDriverEquipmentDelete = async(e, driverId, type, qty)=>{
        console.log('EQUIPMENT DELETE', e, driverId, type, qty)
        try {
            const driverToEdit = currentDrivers.find((driver)=>driver._id === driverId)
            console.log(driverToEdit)
            if (!driverToEdit) {
                throw new Error('Driver Not found');
            }     
            const eqToDelete = {
                type,
                qty
            }   
            const edition = await axios.put(`http://localhost:3001/driverEquipmentDelete/${driverToEdit._id}`, eqToDelete);


        } catch (err) {
            console.log(err)
        }
    }
    const onDriverEquipmentAdd = async(driverId, type, qty)=>{
        console.log('ADD EQUIPMENT', driverId, type, qty)
        try {
            const eqInfo = {
                type,
                qty
            }
            const update = await axios.put(`http://localhost:3001/driverEquipmentAdd/${driverId}`, eqInfo)  
            console.log('UUPDATED DRIVER',update) 
        } catch (err) {
            
        }
    }
    const handleDefaultChange = async(trailerName, isChecked) =>{//TRACKS THE CHECKING OF A DEFAULT CHECKBOX WHILE ADDING A DRIVER
        console.log('handleDefaultChange',trailerName, isChecked)
        try {
            setIsDefaultSelected(true)
        } catch (error) {
            
        }
    }

    //OTHER TYPE TRAILER LOCAL CRUD CONTROLS
    const onSaveOtherTypeTrailer = async(e)=>{//TOGGLE control for other Type trailer && otherTypeTrailer array ADDITION
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
    const onOtherTrailerDelete = async(e, index)=>{//DELETE control for otherTypeTrailers
        console.log('DELETE OOTHER-TYPE TRAILER', e.target, index)
        setOtherTypeTrailerArray(prevState =>{
            let arrayCopy= [...prevState]
            arrayCopy.splice(index, 1)
            return arrayCopy
        })

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
    const onCancelOtherTrailers = async(e,index)=>{//TOGGLE control for cancel action
        setOtherTypeOfTrailerSelected(false)
    }
    //MISC FUNCTIONS
    const formatDate = (date) => { //this standarizes the date format for the whole program
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    return (
        <div className="mainContent-boardAdmin">
            <div className="newCompanyForm-boardAdmin">
                <form onSubmit={(e)=>onCompanySubmit(e)}>
                <h1>Add a new copany:</h1>

                    <label htmlFor="companyName">Company Name: </label>
                    <input type="text" 
                           name="companyName" 
                           onChange={(e)=>setCompanyName(e.target.value)} 
                           placeholder='Enter a company Name'
                           required/>
                                            
                    <label htmlFor="companyPhoneNumber">Company Phone#:  </label>
                    <input type="number" 
                           name="companyPhoneNumber"
                           onChange={(e)=>setCompanyPhoneNumber(e.target.value)}
                           placeholder='xxx - xxx - xxxx'
                           required 
                    />
                    
                    <label htmlFor="mcNumber">MC#: </label>
                    <input type="number" 
                           name="mcNumber" 
                           onChange={(e)=>setMcNumber(e.target.value)} 
                           placeholder='Enter an MC# '
                           required/>
                    
                    <label htmlFor="dotNumber">DOT#: </label>
                    <input type="number" 
                           name="dotNumber" 
                           onChange={(e)=>setDotNumber(e.target.value)}
                           placeholder='Enter a DOT#'
                           required />

                    <label htmlFor="einNumber">EIN#: </label>
                    <input type="number" 
                           name="einNumber" 
                           onChange={(e)=>setEinNumber(e.target.value)} 
                           placeholder='Enter a EIN#'
                           required/>

                    <label htmlFor="ownerName">Company Owner: </label>
                    <input type="text" 
                           name="ownerName"
                           onChange={(e)=>setOwnerName(e.target.value)} 
                           placeholder='Owner Name'
                           required/>

                    <label htmlFor="ownerPhoneNumber">Owner Phone#: </label>
                    <input type="number" 
                           name="ownerPhoneNumber"
                           onChange={(e)=>setOwnwerPhoneNumber(e.target.value)} 
                           placeholder='xxx - xxx - xxxx'
                           required />

                    <label htmlFor="address">Address: </label>
                    <input type="text" 
                           name="address" 
                           onChange={(e)=>setAddress(e.target.value)} 
                           placeholder='Company registered address'
                           required />

                    <button type="submit">Add</button>
                    
                </form>
                {/* <ToastContainer  REFACTORING NEEDED IF MORE THAN ONE TOAST IS USED/> */} 

            </div>

            <div className='newDriverForm-boardAdmin'>
                   <form ref={formRef}  onSubmit={onDriverAdd}>
                       <h3 id='h3'>Add a new Driver</h3>
                         <label htmlFor="client">Select a Client:</label>
                         <select name="client" id="client" onChange={e => setSelectedCompany(e.target.value)} required>
                            <option value="default" ></option>
                             {Array.from(currentClients).map((company, index) => {
                                return <option key={index} value={company.companyName}>{company.companyName}</option>
                            })}    

                         </select>
                        <div className='newDriverForm-equipmentForm'>
                                <div className='equipmentForm-trailerType'>
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
                                </div>


                            <div className='equipmentForm-equipment'>
                                <div className='equipment-tarps'>
                                <span>Equipment:</span>
                                    <br />
                                    <span>Tarps:   </span>
                                            <br />
                                            <input type="text" className='equipment-tarps8ft' name='equipment-tarps8ft' onChange={e => setTarps8ft(e.target.value)} />
                                            <label htmlFor="equipment-tarps8ft">x 8FT Tarps</label>

                                            <br />
                                            <input type="text" className='equipment-tarps6ft' name='equipment-tarps6ft'  onChange={e => setTarps6ft(e.target.value)} />
                                            <label htmlFor="equipment-tarps6ft">x 6FT Tarps</label>

                                            <br />
                                            <input type="text" className='equipment-tarps4ft' name='equipment-tarps4ft'  onChange={e => setTarps4ft(e.target.value)} />
                                            <label htmlFor="equipment-tarps4ft">x 4FT Tarps</label>


                                </div>

                                <div className='equipment-sec'>
                                <span>Securing:   </span>
                                            <br />
                                            <input type="text" className='equipment-chains' name='equipment-chains'  onChange={e => setChains(e.target.value)} />
                                            <label htmlFor="equipment-chains">x Chains</label>

                                            <br />
                                            <input type="text" className='equipment-binders' name='equipment-binders'  onChange={e => setBinders(e.target.value)} />
                                            <label htmlFor="equipment-binders">x Binders</label>

                                            <br />
                                            <input type="text" className='equipment-pipeStakes' name='equipment-pipeStakes'  onChange={e => setPipeStakes(e.target.value)} />
                                            <label htmlFor="equipment-pipeStakes">x PipeStakes</label>

                                            <br />
                                            <input type="text" className='equipment-dunnage' name='equipment-dunnage'  onChange={e => setDunnage(e.target.value)} />
                                            <label htmlFor="equipment-dunnage">x Dunnage</label>

                                </div>    
                                
                            </div>
                        </div>    
                        <div className='newDriverForm-driverForm'>
                            <label htmlFor="driverName">Driver Name:</label>
                            <input type="text" name='driverName'  onChange={e =>setDriverName(e.target.value)} required placeholder='Driver Name'/>

                            <label htmlFor="driverPhoneNumber">Driver Phone#:</label>
                            <input type="text" name='driverPhoneNumber' onChange={e =>setDriverPhone(e.target.value) } required placeholder='xxx - xxx - xxxx' />
                            
                            <label htmlFor="currentLocation">Current Location:</label>
                            <input type="text" name='currentLocation' onChange={e => setCurrentLocation(e.target.value)} required placeholder='Current location' />
                            
                            <label htmlFor="inactiveDriver">Inactive</label>
                            <input type="checkBox" name="inactiveDriver" id="inactiveDriver"  onChange={e => setDriverStatus(e.target.checked ? 'inactive' : null)} />   
                            
                            <label htmlFor="availableDate">Available Date:</label>                                                        
                            <input type="date" name="availableDate" id="" onChange={e => onDateSetup(e, e.target.value)} disabled={driverStatus} required />
          
                            <label htmlFor="assignedDispatcher">Assigned Dispatcher</label>
                            <select id="assignedDispatcher" name="assignedDispatcher" onChange={e => setAssignedDispatcher(e.target.value)}>
                                <option value="default">Select a dispatcher:</option>
                                <option value="dispatcher1">dispatcher1</option>
                                <option value="dispatcher2">dispatcher2</option>
                                <option value="dispatcher3">dispatcher3</option>
                            </select>                            
                                                                    
                            <button type='submit' >Save</button>
                            <button type='button' onClick={(e)=>onDriverAddCancel(e)}>Cancel</button>
                            {/* <button type='button' onClick={(e)=>onAddAnotherDriver(e)} disabled={addAnotherDriver === false}> Add another Driver</button> */}

                        </div>         
                   </form>
                   <ToastContainer />

            </div>

            <div className='companyBoard-boardAdmin'>
                <h1>Current Companies</h1>         
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
                        {Array.from(currentClients).map((client, index) => (
                        editingCompanyIndex === index ? ( // COMPANY EDIT MODE ON
                            <React.Fragment key={index}>
                            <tr>
                                <td><input type="text" value={client.companyName} onChange={(e) => handleClientChange(index, 'companyName', e.target.value)} /></td>
                                <td><input type="number" value={client.companyPhoneNumber} onChange={(e) => handleClientChange(index, 'companyPhoneNumber', e.target.value)}  /></td>
                                <td><input type="text" value={client.ownerName} onChange={(e) => handleClientChange(index, 'ownerName', e.target.value)} /></td>
                                <td><input type="number" value={client.ownerPhoneNumber} onChange={(e) => handleClientChange(index, 'ownerPhoneNumber', e.target.value)} /></td>
                                <td><input type="text" value={client.address} onChange={(e) => handleClientChange(index, 'address', e.target.value)} /></td>
                                <td><input type="number" value={client.mcNumber} onChange={(e) => handleClientChange(index, 'mcNumber', e.target.value)} /></td>
                                <td><input type="number" value={client.dotNumber} onChange={(e) => handleClientChange(index, 'dotNumber', e.target.value)} /></td>
                                <td><input type="number" value={client.einNumber} onChange={(e) => handleClientChange(index, 'einNumber', e.target.value)} /></td>
                                <td>
                                    <button onClick={(e) => onCompanyEditSave(e, index, client._id)} type='button'>Save</button>
                                    <button onClick={(e) => onCompanyEditCancel(e, index)} type='button'>Cancel</button>
                                </td>   
                            </tr>
                            </React.Fragment>
                        ) : ( //COMPANY EDIT MODE OFF 
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
                                        <button onClick={(e) => handleDeleteClick(e, client._id, client.companyName)} type='button'>Delete</button>
                                    </td>
                                </tr>
                                
                                {/* NESTED DRIVER ARRAY START */}
                                <DriverAdmin 
                                        client={client}
                                        currentDrivers={currentDrivers}
                                        editingDriverIndex={editingDriverIndex}
                                        editingDriverCompany={editingDriverCompany}
                                        onHandleDriverChange={onHandleDriverChange}
                                        onDriverEditSave={onDriverEditSave}
                                        onDriverEdit={onDriverEdit}
                                        onDriverDelete={onDriverDelete}
                                        onDriverTrailerDelete={onDriverTrailerDelete}
                                        onDriverTrailerAdd={onDriverTrailerAdd}
                                        onDriverEquipmentDelete={onDriverEquipmentDelete}
                                        onDriverEquipmentAdd={onDriverEquipmentAdd}
                                />
                                {/* NESTED DRIVER ARRAY END */}

                            </React.Fragment>
                        )
                        ))}
                        
                    </tbody>
                    
                </table>
                <ConfirmationModal
                        isOpen={showModal}
                        message={`Are you sure you want to delete company ${deleteInfo.companyName} from the DB?`}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        />
                
            </div>
        </div>
    )
}

export default BoardAdmin