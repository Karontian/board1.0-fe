import { useState } from 'react'
import axios from 'axios'

import './boardAdmin.css'

const BoardAdmin  = () =>{

    const [companyName, setCompanyName] = useState('')
    const onChange = (event) =>{
        setCompanyName(event.target.value)
    }
    
    const onCompanySubmit = async() =>{
        console.log('COMPANY ADD')
        try{
            const newCompany = {
                companyName: companyName
            }
            const addition = await axios.post('http://localhost:3001/newCompany', newCompany)
            console.log(addition)

        }catch(err){
            console.log(err)
        }
        

    }

    console.log(companyName)
    return (
        <div className="mainContent-boardAdmin">
            <div className="newCompanyForm-boardAdmin">
                <form >
                <h1>New Company Add:</h1>

                    <label htmlFor="CompanyName">Company Name: </label>
                    <input type="text" name="CompanyName" value={companyName} onChange={onChange}/>
                    
                    <label htmlFor="CompanyMc">MC#: </label>
                    <input type="text" name="CompanyMc" onChange={onChange}/>
                    
                    <label htmlFor="CompanyDOT">DOT#: </label>
                    <input type="text" name="CompanyDOT" onChange={onChange} />

                    <label htmlFor="CompanyEIN">EIN#: </label>
                    <input type="text" name="CompanyEIN" onChange={onChange}/>

                    
                    <label htmlFor="CompanyOwnerName">Company Owner: </label>
                    <input type="text" name="CompanyOwnerName"onChange={onChange} />

                    <label htmlFor="CompanyPhoneNumber">Phone#: </label>
                    <input type="text" name="CompanyPhoneNumber"onChange={onChange} />

                    <label htmlFor="companyAddress">Address: </label>
                    <input type="text" name="companyAddress" onChange={onChange} />

                    <button type="button" onClick={onCompanySubmit}>Add</button>
                    
                </form>
            </div>
        </div>
    
    )
}

export default BoardAdmin