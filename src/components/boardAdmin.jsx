import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './boardAdmin.css'
import DriverAdmin from './driverAdmin'
import ConfirmationModal from './confirmationModal'
import './ConfirmationModal.css'; // Import the CSS file for styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AddCompanyModal from './addCompanyModal';
import AddDriverModal from './addDriverModal'
import Header from "./header"
import Footer from "./footer"



const BoardAdmin  = () =>{

    const navigate = useNavigate();
    const location = useLocation();
    const { username, user } = location.state || {};

    
    useEffect(() => {
        if (username !== 'admin') {
            navigate('/login');
        }
    }, [username, navigate]);



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
    const [currentUsers, setCurrentUsers] = useState('')

    //MODAL VARIABLES
    const [isaddCompanyModalOpen, SetIsAddCompanyModalOpen] = useState(false);
    const [isaddDriverModalOpen, setIsAddDriverModalOpen] = useState(false)

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

    
/// SSE DEPENDANT UPDATES HAVE BEEN UPDATED FORR A TIMER BASED PULL CONFIGURATION REMAINS IN COMMENTS
    useEffect(() => {//MONITORS Server changes && OtherTypeTrailer array
        getClients()
        getDrivers()
        getUsers()

        //SSE UPDATE ENGINGE NOT SUPPORTED BY NETLIFLY
        // const driverEventSource = new EventSource('http://localhost:3001/driverUpdates');
        // const clientEventSource = new EventSource('http://localhost:3001/clientUpdates');
            
        // driverEventSource.onmessage = (event) => {
        //     const drivers = JSON.parse(event.data);
        //     setCurrentDrivers(drivers)
        // };
        
        // clientEventSource.onmessage = (event) => {
        //     const clients = JSON.parse(event.data);
        //     setCurrentClients(clients)
        // };
                //SSE UPDATE ENGINGE NOT SUPPORTED BY NETLIFLY

        
        const fetchServerInfoInterval = setInterval(() => {
            getClients();
            getDrivers();
            getUsers();
        }, 1000);

        if (otherTypeTrailerArray.length === 0) {// RESETS the addDriver form on change to 0 of otherTrypeTrailer array
            // formRef.current.reset();
            
        }
    
        return () => {
            // driverEventSource.close();         //SSE UPDATE ENGINGE NOT SUPPORTED BY NETLIFLY
            // clientEventSource.close();        //SSE UPDATE ENGINGE NOT SUPPORTED BY NETLIFLY
            clearInterval(fetchServerInfoInterval);

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
    const getDrivers = async()=>{//FETCH added drivers
        try {
            let response = await axios.get(`http://localhost:3001/getDrivers`)
            // console.log('GET DRIVERS RESPONSE', response)
            setCurrentDrivers(response.data.drivers)
        } catch (err) {
            console.log(err)
        }
    }
    const getUsers = async()=>{
        try {
            const response = await axios.get(`http://localhost:3001/getUsers`)
            setCurrentUsers(response.data.users)
        } catch (err) {
            console.log(err)
        }
    }
/// SSE DEPENDANT UPDATES HAVE BEEN UPDATED FORR A TIMER BASED PULL  CONFIGURATION REMAINS IN COMMENTS

    //COMPANY CRUD CONTRLS 
    const onCompanySubmit = async(companyData) =>{//ADDS A COMPANY
        // e.preventDefault()
        console.log('COMPANY ADD', companyData)
        try {
            const newCompany = {
              companyName: companyData.companyName,
              ownerName: companyData.ownerName,
              ownerPhoneNumber: companyData.ownerPhoneNumber,
              companyPhoneNumber: companyData.companyPhoneNumber,
              address: companyData.address,
              mcNumber: companyData.mcNumber,
              dotNumber: companyData.dotNumber,
              einNumber: companyData.einNumber,
            };
      
            const existingCompany = currentClients.find(company => company.companyName === newCompany.companyName);
            if (existingCompany) {
              alert('There is already a company with the same name');
              return; // Exit the function if the company already exists
            }
      
            const addition = await axios.post('http://localhost:3001/newCompany', newCompany);
            if (addition) {
              toast.success("New company added successfully", {
                autoClose: 500, // Duration in milliseconds (500ms = 0.5 seconds)
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              // Update the currentClients state with the new company
              setCurrentClients([...currentClients, newCompany]);
            }
          } catch (err) {
            console.log(err);
          }
      
        // try{
        //     const newCompany = {
        //         companyName: companyName,
        //         ownerName: ownerName,
        //         ownerPhoneNumber: ownerPhoneNumber,
        //         companyPhoneNumber: companyPhoneNumber,
        //         address: address,
        //         mcNumber: mcNumber,
        //         dotNumber: dotNumber,
        //         einNumber: einNumber,
            
        //     }

        //     const existingCompany = currentClients.find(company => company.companyName === newCompany.companyName);
        //     if (existingCompany) {
        //         alert('There is already a company with the same name');
        //         return; // Exit the function if the company already exists
        //     }

        //     const addition = await axios.post('http://localhost:3001/newCompany', newCompany)
        //     if (addition) {
        //        const companyToast=  toast.success("New company added successfully", {
        //             autoClose: 500, // Duration in milliseconds (5000ms = 5 seconds)
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             draggable: true,
        //             progress: undefined,
        //         });              

        //     }

        // }catch(err){
        //     console.log(err)
        // }
        // e.target.reset()
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


    //FORM MODAL CONTROL
    const handleAddCompanyOpen = () => {
        SetIsAddCompanyModalOpen(true);
      };
    
      const handleAddCompanyClose = () => {
        SetIsAddCompanyModalOpen(false);
      };

      const handleAddDriverModalOpen = () => {
        setIsAddDriverModalOpen(true);
      };
    
      const handleAddDriverModalClose = () => {
        setIsAddDriverModalOpen(false);
      };
   
   
    


    ///
    //MISC FUNCTIONS
    const formatDate = (date) => { //this standarizes the date format for the whole program
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const onLogout = async()=>{//logs the user out
        console.log('LOGOUT')
        try {
            const req = await axios.put(`http://localhost:3001/logout`, { username})
            console.log(req)
        } catch (err) {
            console.log(err)            
        }
        navigate('/')
    }
    const onUserDelete = async(username)=>{//deletes a system user  
        try {
            console.log(username)
            const response = await axios.delete(`http://localhost:3001/deleteUser/${username}`)
            console.log(response)
            toast.success("User deleted successfully");

        } catch (err) {
            console.log(err)
        }
    }
    // console.log(currentClients, currentDrivers, currentUsers)

    return (
        <div >
        <Header/>

        <div className="mainContent-boardAdmin">


                     <span id='userSpan'>Welcome {username}!! /</span>
                     <button type='button' onClick={onLogout}
                        style={{ 
                            backgroundColor: '#f44336', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            padding: '5px 10px', 
                            cursor: 'pointer',
                            marginLeft: '10px' // Ensure some spacing between elements
                        }}
                     
                     >LogOut</button>
                     <Link  
                         to="/mainBoard" 
                         state={{ username }} 
                         style={{ marginLeft: '10px' }}
                        >
                            Main Board
                    </Link>

                </div>
           
            <div className="mainContent-boardAdmin-container">
            <div className="mainContent-boardAdmin">
                <button type="button" onClick={handleAddCompanyOpen}>Add New Company</button>
                <AddCompanyModal
                    isOpen={isaddCompanyModalOpen}
                    onRequestClose={handleAddCompanyClose}
                    onSubmit={onCompanySubmit}
                />
            </div>

            <div className="mainContent-boardAdmin">
                <button type="button" onClick={handleAddDriverModalOpen}>Add New Driver</button>
                <AddDriverModal
                    isOpen={isaddDriverModalOpen}
                    onRequestClose={handleAddDriverModalClose}
                    onSubmit={onDriverAdd}
                    currentClients={currentClients}
                    onSaveOtherTypeTrailer={onSaveOtherTypeTrailer}
                    onOtherTrailerDelete={onOtherTrailerDelete}
                    onOtherTrailerEdit={onOtherTrailerEdit}
                    onOtherTrailerEditSave={onOtherTrailerEditSave}
                    onCancelOtherTrailers={onCancelOtherTrailers}
                    handleCheckboxChange={handleCheckboxChange}
                />
            </div>
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
                            <tr className='company-row'>
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
                                <tr className='company-row'> 
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

            <div className='companyBoard-systemUserAdmin'>
                <h2>Current System users</h2>
                <table>
                    <thead>
                        <tr className='company-row'>
                            <th>User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from(currentUsers).map((user, index) => (
                            <tr key={index} className='driver-row'>
                                <td>{user.username}</td>
                                <td>
                                    <button type='button' onClick={() => onUserDelete(user.username)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <Footer/>
        </div>
        
    )
}

export default BoardAdmin