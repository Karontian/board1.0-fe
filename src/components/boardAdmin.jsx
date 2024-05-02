import { useEffect, useState } from 'react'
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
    
    const onCompanySubmit = async() =>{
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

  console.log(currentClients)


    return (
        <div className="mainContent-boardAdmin">
            <div className="newCompanyForm-boardAdmin">
                <form >
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

                    <button type="button" onClick={onCompanySubmit}>Add</button>
                    
                </form>
            </div>
            <div className='companyBoard-boardAdmin'>
            <table>
                <thead>
                    <tr>
                        <th>Company Name</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(currentClients).map((company, index) => {
                        return (
                            <tr key={index}>
                                <td>{company.companyName}</td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot></tfoot>
             </table>
                
                {/* {Array.from(currentClients).map((company, index)=>{
                    return <span>{company.companyName}</span>
                })} */}
            </div>
        </div>
    
    )
}

export default BoardAdmin