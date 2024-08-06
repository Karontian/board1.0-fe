import React, { useState } from 'react';
import Modal from 'react-modal';

const AddTrailerModal = ({ isOpen, onRequestClose, onSubmit, currentDriverId }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [len, setLen] = useState('');
  const [def, setDef] = useState(false)
  const [onOtherTrailer, setOnOtherTrailer] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault(); 
    const finalType = type === 'Other' ? onOtherTrailer : type;
    onSubmit(amount, finalType, len, def);
    onRequestClose();
    setAmount('')
    setType('')
    setLen('')
    setDef('')
    setOnOtherTrailer('');


  };

  const onHandleCancel = (e) =>{
    e.preventDefault()
    onRequestClose();
    setAmount('')
    setType('')
    setLen('')
    setDef('')
    setOnOtherTrailer('');

  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>DriverID#: {currentDriverId}</h2>
      <form onSubmit={handleSubmit}>
        <h3>Add a trailer</h3>
        <label>
          Amount:
          <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </label>

        <label>
            Type:
            <select value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="default">Select a trailer type:</option>
                <option value="Flatbed">Flatbed</option>
                <option value="DryVan">DryVan</option>
                <option value="Refeer">Refeer</option>
                <option value="Other">Other</option>
            </select>
        </label>  
            {type === 'Other' && (
                <label>
                    Other Type Trailer:
                    <input
                        type="text"
                        value={onOtherTrailer}
                        onChange={(e) => setOnOtherTrailer(e.target.value)}
                        required
                    />
                </label>
                 )}

        <label>
          Length:
          <input type="text" value={len} onChange={(e) => setLen(e.target.value)} required />
        </label>
        <label>
          default?:
          <input type='checkBox' checked={def} value={def} onChange={(e)=>setDef(e.target.checked)}/>
        </label>
        <button type="submit">Add</button>
        <button type='button' onClick={(e)=>onHandleCancel(e)}>Cancel</button>

        
      </form>
    </Modal>
  );
};

export default AddTrailerModal;