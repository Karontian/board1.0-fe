import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './boardAdmin.css'

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
    const [ottEditingDefault, setOttEditingDefault] = useState('')//default value

    

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

    //DATA REFS
        ///OTHER TRAILER TYPE DATA HOLDERS
    const amountRef = useRef();
    const typeRef = useRef();
    const lengthRef = useRef();
    const defaultRef = useRef();
    const formRef = useRef(); //CONTROLS THE FORM TO ADD NEW DRIVER INFO
    const timeoutRef = useRef();/// CONTROLS THE TIMEOUT CLEAN OF ARRAYS AFTER DRIVER ADD



    useEffect(() => {//MONITORS Server changes && OtherTypeTrailer array
        getClients()
        const eventSource = new EventSource('http://localhost:3001/');
    
        eventSource.onmessage = (event) => { //SERVER SIDE EFFECT pull from DB to feed current clients dropdown
            const clients = JSON.parse(event.data);
            setCurrentClients(clients)
        };
        if (otherTypeTrailerArray.length === 0) {// RESETS the addDriver form on change to 0 of otherTrypeTrailer array
            formRef.current.reset();
            
        }
    
        return () => {
            eventSource.close();
        };
    }, [otherTypeTrailerArray]);



    const getClients = async()=>{//FETCH added clients
        try {
            let response =  await axios.get('http://localhost:3001/getClients')
            let clients = response.data.clients
            setCurrentClients(clients)

        } catch (error) {
            console.log(error)
        }
    }


    //COMPANY  AND DRIVER ADD CONTROLS
    const onCompanySubmit = async(e) =>{//ADDS A COMPANY
        e.preventDefault()
        console.log('COMPANY ADD')
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
            const addition = await axios.post('http://localhost:3001/newCompany', newCompany)
            console.log(addition)

        }catch(err){
            console.log(err)
        }
        e.target.reset()

    }

    const onDriverAdd = async(e) =>{ //ADDS A DRIVER, includes: Company Info, Driver info and Equipment info
        try {
            console.log('ADDING DRIVER', e.target)
            e.preventDefault();
            clearTimeout(timeoutRef.current);
            const fb48Amount = e.target.elements['fb48-ammount'].value;
            const fb48Checked = e.target.elements['default-fb48'].checked;
            const fb53Amount = e.target.elements['fb53-ammount'].value;
            const fb53Checked = e.target.elements['default-fb53'].checked;
    
            const van48Amount = e.target.elements['van48-ammount'].value;
            const van48Checked = e.target.elements['default-van48'].checked;
            const van53Amount = e.target.elements['van53-ammount'].value;
            const van53Checked = e.target.elements['default-van53'].checked;
    
            const reefer48Amount = e.target.elements['reefer48-ammount'].value;
            const reefer48Checked = e.target.elements['default-reefer48'].checked;
            const reefer53Amount = e.target.elements['reefer53-default'].value;
            const reefer53Checked = e.target.elements['default-reefer53'].checked;
        
            let newTrailerArray = [...otherTypeTrailerArray, 
                { amount: fb48Amount, type: 'flatbed', length: '48', defaultTrailer: fb48Checked },
                { amount: fb53Amount, type: 'flatbed', length: '53', defaultTrailer: fb53Checked },
                { amount: van48Amount, type: 'van', length: '48', defaultTrailer: van48Checked },
                { amount: van53Amount, type: 'van', length: '53', defaultTrailer: van53Checked },
                { amount: reefer48Amount, type: 'reefer', length: '48', defaultTrailer: reefer48Checked },
                { amount: reefer53Amount, type: 'reefer', length: '53', defaultTrailer: reefer53Checked }
            ];
            
            // setTrailerArray(prev => [...prev, ...newTrailerArray]);           
            const newSelectedEquipment = {
                tarps8ft: tarps8ft,
                tarps6ft: tarps6ft,
                tarps4ft: tarps4ft,
                pipeStakes: pipeStakes,
                dunnage: dunnage,
                chains: chains,
                binders: binders
            };
            // setSelectedEquipment(newSelectedEquipment);
    
    
            const additionCall = await axios.post('http://localhost:3001/driverAdd',{
                driverInfo: [driverName, driverPhone, selectedCompany],
                equipmentInfo: [newSelectedEquipment],
                trailerInfo: [...newTrailerArray]
            })
            console.log(additionCall)

            timeoutRef.current = setTimeout(() => {//RESETS all arrays 1sec after addition
                setTrailerArray([])
                setOtherTypeTrailerArray([]);
                setSelectedEquipment([]);
                setSelectedCompany('');
                setDriverName('');
                setDriverPhone('');
            }, 1000);
            
        } catch (err) {
            console.log(err)
        }

    }

    //OTHER TYPE TRAILER LOCAL CRUD CONTROLS
    const onSaveOtherTypeTrailer = async(e)=>{//TOGGLE control for other Type trailer && otherTypeTrailer array ADDITION
        try {
            let amount = amountRef.current.value
            let type = typeRef.current.value
            let length = lengthRef.current.value
            let defaultTrailer = defaultRef.current.checked
            console.log('DEFAULT T', defaultTrailer)
            setOtherTypeTrailerArray(prev => [...prev, { amount, type, length, defaultTrailer }]);                
            setOtherTypeOfTrailerSelected(false)
            setOttEditingAmount(amount)
            setOttEditingLenght(length)
            setOttEditingType(type)
            setOttEditingDefault(defaultTrailer)
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

    const onOtherTrailerEdit = async(e,index)=>{//TOGGLE control to add other type trailers
        console.log('ON OTHER  TRAILER EDIT', e, index)
        setEditingIndex(true)
        const item = otherTypeTrailerArray[index];
        console.log(item.defaultTrailer)
        setOttEditingAmount(item.amount);
        setOttEditingType(item.type);
        setOttEditingLenght(item.length);
        setOttEditingDefault(item.defaultTrailer);
        setEditingIndex(index);  // Set the editing index here

    
    }

    const onOtherTrailerEditSave = async(e,index)=>{//TOGGLE control for other Type trailer && otherTypeTrailer array EDDITION
        console.log('ON SAVE')
        const newOtherTypeTrailerArray = [...otherTypeTrailerArray]
        newOtherTypeTrailerArray[index] = {
            ...newOtherTypeTrailerArray[index],
            amount: ottEditingAmount,
            type: ottEditingType,
            length: ottEditingLenght,
            defaultTrailer: ottEditingDefault
        }
        setOtherTypeTrailerArray(newOtherTypeTrailerArray)
        setEditingIndex(false)
    }

    const onCancelOtherTrailers = async(e,index)=>{
        setOtherTypeOfTrailerSelected(false)
    }

        console.log(trailerArray)

    return (
        <div className="mainContent-boardAdmin">
            <div className="newCompanyForm-boardAdmin">
                <form onSubmit={(e)=>onCompanySubmit(e)}>
                <h1>Add a new copany:</h1>

                    <label htmlFor="companyName">Company Name: </label>
                    <input type="text" name="companyName" onChange={(e)=>setCompanyName(e.target.value)}/>
                    
                    <label htmlFor="companyPhoneNumber">Company Phone#: </label>
                    <input type="text" name="companyPhoneNumber"onChange={(e)=>setCompanyPhoneNumber(e.target.value)} />

                    <label htmlFor="mcNumber">MC#: </label>
                    <input type="text" name="mcNumber" onChange={(e)=>setMcNumber(e.target.value)}/>
                    
                    <label htmlFor="dotNumber">DOT#: </label>
                    <input type="text" name="dotNumber" onChange={(e)=>setDotNumber(e.target.value)} />

                    <label htmlFor="einNumber">EIN#: </label>
                    <input type="text" name="einNumber" onChange={(e)=>setEinNumber(e.target.value)}/>

                    <label htmlFor="ownerName">Company Owner: </label>
                    <input type="text" name="ownerName"onChange={(e)=>setOwnerName(e.target.value)} />

                    <label htmlFor="ownerPhoneNumber">Owner Phone#: </label>
                    <input type="text" name="ownerPhoneNumber"onChange={(e)=>setOwnwerPhoneNumber(e.target.value)} />

                    <label htmlFor="address">Address: </label>
                    <input type="text" name="address" onChange={(e)=>setAddress(e.target.value)} />

                    <button type="submit">Add</button>
                    
                </form>
            </div>

            <div className='newDriverForm-boardAdmin'>
                   <form ref={formRef}  onSubmit={onDriverAdd}>
                       <h3 id='h3'>Add a new Driver</h3>
                         <label htmlFor="client">Select a Client:</label>
                         <select name="client" id="client" onChange={e => setSelectedCompany(e.target.value)}>
                            <option value="default" ></option>
                             {Array.from(currentClients).map((company, index) => {
                                return <option key={index} value={company.companyName}>{company.companyName}</option>
                            })}    

                         </select>
                        <div className='newDriverForm-equipmentForm'>
                            <div className='equipmentForm-trailerType'>
                                <strong>Trailer Type:</strong>

                                <div className='trailerType-fb'>
                                    <input type="text" className='equipmentOption-trailerType' name='fb48-ammount'  onChange={e => setFb48Amount(e.target.value)} />
                                    <label htmlFor="fb48-ammount">xFB48 default?</label>
                                    <input type="checkBox" id='fb48' name='default-fb48' onChange={e => setFb48Checked(e.target.checked)} />


                                    <input type="text" className='equipmentOption-trailerType' name='fb53-ammount'  onChange={e => setFb53Amount(e.target.value)} />
                                    <label htmlFor="fb53-ammount">xFB53 default?</label>
                                    <input type="checkBox" id='fb53' name='default-fb53'  onChange={e => setFb53Checked(e.target.checked)} />

                                </div>
                                <div className='trailerType-van'>

                                    <input type="text" className='equipmentOption-trailerType' name='van48-ammount'onChange={e => setVan48Amount(e.target.value)} />
                                    <label htmlFor="van48-ammount">xV48 default?</label>
                                    <input type="checkBox" id='van48' name='default-van48'  onChange={e => setVan48Checked(e.target.checked)} />

                                    
                                    <input type="text" className='equipmentOption-trailerType' name='van53-ammount' onChange={e => setVan53Amount(e.target.value)} />
                                    <label htmlFor="van53-ammount">xV53 default?</label>
                                    <input type="checkBox" id='van53' name='default-van53'  onChange={e => setVan53Checked(e.target.checked)} />


                                </div>
                                <div className='trailerType-reefer'>
                                
                                    <input type="text" className='equipmentOption-trailerType' name='reefer48-ammount'  onChange={e => setReefer48Amount(e.target.value)} />
                                    <label htmlFor="reefer48-ammount">xR48 default?</label>
                                    <input type="checkBox" id='reefer48' name='default-reefer48'  onChange={e => setReefer48Checked(e.target.checked)} />

                                    <input type="text" className='equipmentOption-trailerType' name='reefer53-default'  onChange={e => setReefer53Amount(e.target.value)} />
                                    <label htmlFor="reefer53-ammount">xR53 default?</label>
                                    <input type="checkBox" id='reefer53' name='default-reefer53'  onChange={e => setReefer53Checked(e.target.checked)} />


                                </div>
                                <br />
                                <div className='trailerType-other'>
                                    <button type='button' onClick={() => setOtherTypeOfTrailerSelected(true)} disabled={otherTypeOfTrailerSelected === true}>+Other Type Trailer</button>                                

                                            <div className='trailerType-other-form'>
                                                {otherTypeOfTrailerSelected === true && 
                                                    <div  className='other-trailerType'>

                                                    <h5>Add a new Other-Type trailer:</h5>
                                                    
                                                    <input type="text" name='amount'className='other-trailerType-amount'ref={amountRef}/>
                                                    <label htmlFor="amount">x  </label>


                                                    <label htmlFor="type">Type</label>
                                                    <input type="text" name='type' className='other-trailerType-type'ref={typeRef}/>
                                                    <br />

                                                    <label htmlFor="length">Length</label>
                                                    <input type="text" name='length'className='other-trailerType-length'ref={lengthRef}/>
                                                    <span>ft    </span>

                                                    <label htmlFor="default">Default?</label>
                                                    <input type="checkbox" name='default' className='other-trailerType' ref={defaultRef}/>

                                                    <button type='button'  onClick={(e)=>onSaveOtherTypeTrailer(e)}>Save Trailers</button>    
                                                    <button type='button'  onClick={(e)=>onCancelOtherTrailers(e)}>Cancel</button>                                                        
                                                    
                                                </div>}
                                            </div>
                                            <div className='trailerType-other-grid'>
                                                <h3>Other-Type Trailers added:</h3>
                                                <table>
                                                    <thead>
                                                        <tr>    
                                                            <th>Ammount</th>
                                                            <th>Trailer Type</th>
                                                            <th>Trailer Length</th>
                                                            <th>Default? </th>
                                                            <th>Actions </th>
                                                        </tr>    
                                                    </thead>
                                                    <tbody>
                                                        {otherTypeTrailerArray.map((item, index) => (
                                                            editingIndex === index ? (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <label htmlFor="editedAmount"></label>
                                                                        <input type="text" name='editedAmount' value={ottEditingAmount} onChange={(e) => setOttEditingAmount(e.target.value)}  />
                                                                    </td>
                                                                    <td>
                                                                        <label htmlFor="editedType"></label>
                                                                        <input type="text" name='editedType' value={ottEditingType} onChange={(e) => setOttEditingType(e.target.value)}/>
                                                                    </td>
                                                                    <td>
                                                                        <label htmlFor="editedLenght"></label>
                                                                        <input type="text" name='editedLenght' value={ottEditingLenght} onChange={(e) => setOttEditingLenght(e.target.value)} />
                                                                    </td>
                                                                    <td>
                                                                        <input type="checkBox" name='editedDefault' checked={ottEditingDefault} onChange={(e)=>setOttEditingDefault(e.target.checked)} />
                                                                    </td>
                                                                    <td>
                                                                        <button type='button' onClick={(e)=>onOtherTrailerEditSave(e, index)}>Save</button>
                                                                        <button type='button'>Cancel</button>
                                                                    </td>

                                                                </tr>
                                                            ) :
                                                            (<tr key={index}>
                                                                <td>{item.amount}</td>
                                                                <td>{item.type}</td>
                                                                <td>{item.length}</td>
                                                                <td>
                                                                    {/* {item.defaultTrailer ? 'Yes' : 'No'} */}
                                                                    <label htmlFor="defaultTrailer"></label>
                                                                    <input type="checkBox"  name='defaultTrailer' checked={item.defaultTrailer} readOnly/>


                                                                </td>
                                                                <td>
                                                                    <button type='button' onClick={(e)=>onOtherTrailerDelete(e, index)}>Delete</button>
                                                                    <button type='button' onClick={(e)=>onOtherTrailerEdit(e, index)}>Edit</button>
                                                                </td>
                                                            </tr>)
                                                        ))}
                                                        {otherTypeTrailerArray.map((item, index)=>{
                                                            <tr key={index}>
                                                                {editingIndex === index ? 
                                                                (
                                                                    <>
                                                                        <td>
                                                                            <label htmlFor="editedAmount"></label>
                                                                            <input type="text" name='editedAmount' value={ottEditingAmount} onChange={(e) => setOttEditingAmount(e.target.value)}  />
                                                                        </td>
                                                                        <td>
                                                                            <label htmlFor="editedType"></label>
                                                                            <input type="text" name='editedType' value={ottEditingType} onChange={(e) => setOttEditingType(e.target.value)}/>
                                                                        </td>
                                                                        <td>
                                                                            <label htmlFor="editedLenght"></label>
                                                                            <input type="text" name='editedLenght' value={ottEditingLenght} onChange={(e) => setOttEditingLenght(e.target.value)} />
                                                                        </td>
                                                                        <td>
                                                                            <input type="checkBox" name='editedDefault' checked={ottEditingDefault} onChange={(e)=>setOttEditingDefault(e.target.checked)} />
                                                                        </td>
                                                                        <td>
                                                                            <button type='button' onClick={(e)=>onOtherTrailerEditSave(e, index)}>Save</button>
                                                                            
                                                                            <button type='button'>Cancel</button>
                                                                        </td>
                                                                    
                                                                    </>
                                                                )
                                                                
                                                                :
                                                                
                                                                (
                                                                <>
                                                                    <td>{item.amount}</td>
                                                                    <td>{item.type}</td>
                                                                    <td>{item.length}</td>
                                                                    <td>
                                                                        {/* {item.defaultTrailer ? 'Yes' : 'No'} */}
                                                                        <label htmlFor="defaultTrailer"></label>
                                                                        <input type="checkBox"  name='defaultTrailer' checked={item.defaultTrailer} readOnly/>


                                                                    </td>
                                                                    <td>
                                                                        <button type='button' onClick={(e)=>onOtherTrailerDelete(e, index)}>Delete</button>
                                                                        <button type='button' onClick={(e)=>onOtherTrailerEdit(e, index)}>Edit</button>
                                                                    </td>
                                                                </>
                                                                )
                                                                }
                                                            </tr>
                                                        })}

                                                    </tbody>
                                                    <tfoot>
                                                    </tfoot>
                                                </table>
                                            </div>
                                      <div>  
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
                            <input type="text" name='driverName'  onChange={e =>setDriverName(e.target.value)}/>

                            <label htmlFor="driverPhoneNumber">Driver Phone#:</label>
                            <input type="text" name='driverPhoneNumber' onChange={e =>setDriverPhone(e.target.value)} />
                            
                            <button type='submit' >Add+</button>
                            {/* <button type='button' onClick={(e)=>onAddAnotherDriver(e)} disabled={addAnotherDriver === false}> Add another Driver</button> */}

                        </div>         
                   </form>
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
                   
                        {Array.from(currentClients).map((company, index) => {
                            return (
                                <React.Fragment key={index} >
                                    <tr className="companyRow">
                                        <td>{company.companyName}</td>
                                        <td>{company.companyPhoneNumber}</td>
                                        <td>{company.ownerName}</td>
                                        <td>{company.ownerPhoneNumber}</td>
                                        <td>{company.address}</td>
                                        <td>{company.mcNumber}</td>
                                        <td>{company.dotNumber}</td>
                                        <td>{company.einNumber}</td>
                                        <td>
                                            <button>Edit Cpmpany</button>
                                            <button>Delete Company</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="10">
                                            <table className='driverTable'>
                                              
                                                <thead>
                                             
                                                    <tr>
                                                        <th>Driver Name</th>
                                                        <th>Driver Phone#</th>
                                                        <th>Trailer Type</th>
                                                        <th>Current Location</th>
                                                        <th>Next Load Needed</th>
                                                        <th>Assigned Dispatcher</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Driver elements here</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                    <tfoot></tfoot>
                </table>
       
            </div>
        </div>
    )
}

export default BoardAdmin