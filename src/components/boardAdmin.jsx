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
    const [einNumber, setEinNumber] = useState('')
    const [currentClients, setCurrentClients] = useState('')


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
    


    return (
        <div className="mainContent-boardAdmin">
            <div className="newCompanyForm-boardAdmin">
                <form onSubmit={(e)=>onCompanySubmit(e)}>
                <h1>New Company Add:</h1>

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
                                            <button type='button'>Add Driver</button>
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