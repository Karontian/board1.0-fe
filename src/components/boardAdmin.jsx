import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './boardAdmin.css'

const BoardAdmin  = () =>{

    const [companyName, setCompanyName] = useState('')
    const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerPhoneNumber, setOwnwerPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [mcNumber, setMcNumber] = useState('');
    const [dotNumber, setDotNumber] = useState('');
    const [einNumber, setEinNumber] = useState('');
    const [currentClients, setCurrentClients] = useState('');
    const [equipment, setEquipment] = useState([])

    

    useEffect(() => {
        getClients()
        const eventSource = new EventSource('http://localhost:3001/');
    
        eventSource.onmessage = (event) => {
            const clients = JSON.parse(event.data);
            setCurrentClients(clients)
        };
    
        return () => {
            eventSource.close();
        };
    }, []);


    const onChange = (event) =>{
        const {name, value} = event.target
        console.log(name, value)
        switch(name){
            case 'companyName':
                setCompanyName(value)
                break
            case 'companyPhoneNumber':
                setCompanyPhoneNumber(value)
                break
            case 'ownerName':
                setOwnerName(value)  
                break
            case 'ownerPhoneNumber':
                setOwnwerPhoneNumber(value)
                break
            case 'address':
                setAddress(value)    
                break
            case 'mcNumber':
                setMcNumber(value)
                break
            case 'dotNumber':
                setDotNumber(value)
                break
            case 'einNumber':
                setEinNumber(value)                     
        }

    }
    
    const onCompanySubmit = async(e) =>{
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

    const getClients = async()=>{
        try {
            let response =  await axios.get('http://localhost:3001/getClients')
            let clients = response.data.clients
            setCurrentClients(clients)

        } catch (error) {
            console.log(error)
        }
    }

    const addEquipment = (e) => {
        const {name} = e.target;
        e.target.checked ? 
        (() => {
            console.log('CHECKED');
            let amount = prompt(`How many ${name} units? `);
            setEquipment(prevEquipment => [...prevEquipment, { name, amount }]);
        })() : 
        (() => {
            console.log('UNCHECK');
            setEquipment(prevEquipment => prevEquipment.filter(item => item.name !== name));

        })();
    }   

    const onDriverAdd = async(e) =>{
        e.preventDefault()
        console.log('DRIVER ADD', e.target)
        const {name, value} = e.target.name
        console.log(name)
        // try {
        //     let driverPost = await axios.post('http://localhost:3001/driverAdd')
        //     console.log(driverPost)

        // } catch (err) {
        //     console.log(err)
        // }
    }



    return (
        <div className="mainContent-boardAdmin">
            <div className="newCompanyForm-boardAdmin">
                <form onSubmit={(e)=>onCompanySubmit(e)}>
                <h1>Add a new copany:</h1>

                    <label htmlFor="companyName">Company Name: </label>
                    <input type="text" name="companyName" onChange={onChange}/>
                    
                    <label htmlFor="companyPhoneNumber">Company Phone#: </label>
                    <input type="text" name="companyPhoneNumber"onChange={onChange} />

                    <label htmlFor="mcNumber">MC#: </label>
                    <input type="text" name="mcNumber" onChange={onChange}/>
                    
                    <label htmlFor="dotNumber">DOT#: </label>
                    <input type="text" name="dotNumber" onChange={onChange} />

                    <label htmlFor="einNumber">EIN#: </label>
                    <input type="text" name="einNumber" onChange={onChange}/>

                    <label htmlFor="ownerName">Company Owner: </label>
                    <input type="text" name="ownerName"onChange={onChange} />

                    <label htmlFor="ownerPhoneNumber">Owner Phone#: </label>
                    <input type="text" name="ownerPhoneNumber"onChange={onChange} />

                    <label htmlFor="address">Address: </label>
                    <input type="text" name="address" onChange={onChange} />

                    <button type="submit">Add</button>
                    
                </form>
            </div>

            <div className='newDriverForm-boardAdmin'>
                   <form  onSubmit={(e)=>onDriverAdd(e)}>
                       <h3>Add a new Driver</h3>
                         <label htmlFor="client">Select a Client:</label>
                         <select name="client" id="client">
                            <option value="default"></option>
                             {Array.from(currentClients).map((company, index) => {
                                return <option key={index} value={company.companyName}>{company.companyName}</option>
                            })}    

                         </select>
                        <div className='newDriverForm-equipmentCheckBoxes'>
                            <div className='equipmentCheckBoxes-trailerType'>
                                <span>Trailer Type:</span>

                                <div className='trailerType-fb'>
                                    
                                    <label htmlFor="fb48">F48</label>
                                    <input type="checkBox" id='fb48' name='fb48' />

                                    <label htmlFor="fb53">F53</label>
                                    <input type="checkBox" id='fb53' name='fb53' />

                                </div>
                                <div className='trailerType-van'>
                                    <label htmlFor="van48">V48</label>
                                    <input type="checkBox" id='van48' name='van48' />

                                    <label htmlFor="van53">V53</label>
                                    <input type="checkBox" id='van53' name='van53' />


                                </div>
                                <div className='trailerType-reefer'>
                                    <label htmlFor="r48">R48</label>
                                    <input type="checkBox" id='r48' name='r48' />

                                    <label htmlFor="r53">R53</label>
                                    <input type="checkBox" id='r53' name='r53' />


                                </div>


                            </div>
                            <div className='equipmentCheckBoxes-equipment'>
                                <span>Equipment:</span>
                                <div className='equipment-tarps'>
                                    <span>Tarps:   </span>

                                            <label htmlFor="tarps8ft">8FT</label>
                                            <input type="checkBox" id='tarps6ft' name='tarps8ft' onClick={(e)=>addEquipment(e)} />

                                            <label htmlFor="tarps6ft">6FT</label>
                                            <input type="checkBox" id='tarps6ft' name='tarps6ft' onClick={(e)=>addEquipment(e)} />

                                            <label htmlFor="tarps4ft">4FT</label>
                                            <input type="checkBox" id='tarps4ft' name='tarps4ft' onClick={(e)=>addEquipment(e)} />


                                </div>

                                <div className='equipment-chains'>
                                <span>Securing:   </span>

                                            <label htmlFor="chains">Chains</label>
                                            <input type="checkBox" id='chains' name='chains' onClick={(e)=>addEquipment(e)} />

                                            <label htmlFor="binders">Binders</label>
                                            <input type="checkBox" id='binders' name='binders' onClick={(e)=>addEquipment(e)} />

                                </div>

                                <div className='equipment-misc'>
                                <span>Miscelanious: </span>

                                        <label htmlFor="pipeStakes">Pipe Stakes</label>
                                        <input type="checkBox" id='pipeStakes' name='pipeStakes' onClick={(e)=>addEquipment(e)}/>

                                        <label htmlFor="dunnage">Dunnage</label>
                                        <input type="checkBox" id='dunnage' name='dunnage' onClick={(e)=>addEquipment(e)} />


                                </div>
                                
                            </div>
                        </div>    
                    
                        <label htmlFor="driverName">Driver Name:</label>
                        <input type="text" name='driverName'/>

                        <label htmlFor="driverPhoneNumber">Driver Phone#:</label>
                        <input type="text" name='driverPhoneNumber' />
                        
                        <button type='submit'>Add+</button>

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