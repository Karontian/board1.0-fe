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
    const [otherChecked, setOtherChecked] = useState(false);
    const [otherAmount, setOtherAmount] = useState("");
    const [otherType, setOtherType] = useState("");
    const [otherLength, setOtherLenght] = useState("");

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

    const addEquipment = async(e) => {
        const {name} = e.target;

        try {
            await e.target.checked ? 
            (() => {
              let amount = prompt(`How many ${name} units? `);
              setEquipment(prevEquipment => [...prevEquipment, { name, amount }]);
  
          })() : 
          (() => {
              console.log('UNCHECK');
              setEquipment(prevEquipment => prevEquipment.filter(item => item.name !== name));
  
          })();
  
        } catch (err) {
            console.log(err)
        }
    }   

    const onDriverAdd = async(e) =>{
        e.preventDefault()
        console.log(e.target)
        console.log('TRAILER EQUIPMENT SELECTION',fb48Checked, fb48Amount, fb53Checked, fb53Amount, van48Checked, van48Amount,
            van53Checked, van53Amount, reefer48Checked, reefer48Amount, reefer53Checked, reefer53Amount,
            otherChecked, otherAmount, otherType, otherAmount, otherLength
        );

        console.log('EQUIPMENT SELECTION', 
        { '8ft tarps': tarps8ft, '6ft tarps': tarps6ft, '4ft tarps': tarps4ft, 'chains': chains,
          'pipeStkes': pipeStakes, 'dunnage': dunnage, 'chains': chains, 'binders': binders }
      );

        console.log('DRIVER INFO', {
            'SelectedCompany': selectedCompany,
            'DriverName': driverName,
            'Driver#': driverPhone

         }

        )
    }


    console.log(selectedCompany)
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
                                <span>Trailer Type:</span>

                                <div className='trailerType-fb'>
                                    <input type="text" className='equipmentOption-trailerType' name='fb48-ammount' value={fb48Amount} onChange={e => setFb48Amount(e.target.value)} />
                                    <label htmlFor="fb48-ammount">xFB48 default?</label>
                                    <input type="checkBox" id='fb48' name='default-fb48' checked={fb48Checked} onChange={e => setFb48Checked(e.target.checked)} />


                                    <input type="text" className='equipmentOption-trailerType' name='fb53-ammount' value={fb53Amount} onChange={e => setFb53Amount(e.target.value)} />
                                    <label htmlFor="fb53-ammount">xFB53 default?</label>
                                    <input type="checkBox" id='fb53' name='default-fb53' checked={fb53Checked} onChange={e => setFb53Checked(e.target.checked)} />

                                </div>
                                <div className='trailerType-van'>

                                    <input type="text" className='equipmentOption-trailerType' name='van48-ammount' value={van48Amount} onChange={e => setVan48Amount(e.target.value)} />
                                    <label htmlFor="van48-ammount">xV48 default?</label>
                                    <input type="checkBox" id='van48' name='default-van48' checked={van48Checked} onChange={e => setVan48Checked(e.target.checked)} />

                                    
                                    <input type="text" className='equipmentOption-trailerType' name='van53-ammount' value={van53Amount} onChange={e => setVan53Amount(e.target.value)} />
                                    <label htmlFor="van53-ammount">xV53 default?</label>
                                    <input type="checkBox" id='van53' name='default-van53' checked={van53Checked} onChange={e => setVan53Checked(e.target.checked)} />


                                </div>
                                <div className='trailerType-reefer'>
                                
                                    <input type="text" className='equipmentOption-trailerType' name='reefer48-ammount' value={reefer48Amount} onChange={e => setReefer48Amount(e.target.value)} />
                                    <label htmlFor="reefer48-ammount">xR48 default?</label>
                                    <input type="checkBox" id='reefer48' name='default-reefer48' checked={reefer48Checked} onChange={e => setReefer48Checked(e.target.checked)} />

                                    <input type="text" className='equipmentOption-trailerType' name='reefer53-ammount' value={reefer53Amount} onChange={e => setReefer53Amount(e.target.value)} />
                                    <label htmlFor="reefer53-ammount">xR53 default?</label>
                                    <input type="checkBox" id='reefer53' name='default-reefer53' checked={reefer53Checked} onChange={e => setReefer53Checked(e.target.checked)} />


                                </div>

                                <span>Other / Special:</span>
                                <div className='equipmentOption-other'>
                                    <input type="text" className='equipmentOption-trailerType' name='other-ammount' value={otherAmount} onChange={e => setOtherAmount(e.target.value)} />
                                    <label htmlFor="other-ammount">xOT/SP default?</label>
                                    <input type="checkBox" id='other' name='default-other' checked={otherChecked} onChange={e => setOtherChecked(e.target.checked)} />
                                   
                                    <br />
                                    <span>Specs: </span> 
                                    <label htmlFor="other-trailerType">TYPE:    </label>
                                    <input type="text" name='other-trailerType' className='other-trailerType' value={otherType} onChange={(e) =>setOtherType(e.target.value)}  />

                                    <label htmlFor="other-trailerLength">   Lenght:</label>
                                    <input type="text" name='other-trailerLength' className='other-trailerType' value={otherLength} onChange={(e)=>setOtherLenght(e.target.value)} />



                                </div>



                            </div>
                            <div className='equipmentForm-equipment'>
                                <div className='equipment-tarps'>
                                <span>Equipment:</span>
                                    <br />
                                    <span>Tarps:   </span>
                                            <br />
                                            <input type="text" className='equipment-tarps8ft' name='equipment-tarps8ft'  onChange={e => setTarps8ft(e.target.value)} />
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
                    
                        <label htmlFor="driverName">Driver Name:</label>
                        <input type="text" name='driverName' value={driverName} onChange={e =>setDriverName(e.target.value)}/>

                        <label htmlFor="driverPhoneNumber">Driver Phone#:</label>
                        <input type="text" name='driverPhoneNumber' value={driverPhone} onChange={e =>setDriverPhone(e.target.value)} />
                        
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