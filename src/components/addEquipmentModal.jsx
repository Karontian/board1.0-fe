import React, { useState } from 'react';
import Modal from 'react-modal';

const AddEquipmentModal = ({ isOpen, onRequestClose, onSubmit, currentDriverId }) => {
  const [type, setType] = useState('');
  const [qty, setQty] = useState('');
  const [onOtherType, setOnOtherType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalType = type === 'other' ? onOtherType : type;
    
    onSubmit(finalType, qty);
    console.log(finalType, qty)
    onRequestClose();
    setType('');
    setQty('');
    setOnOtherType('');
  };

  const onHandleCancel = (e) =>{
    onRequestClose();
    setType('');
    setQty('');
    setOnOtherType('');

  }
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>DriverID#: {currentDriverId}</h2>
      <form onSubmit={handleSubmit}>
        <h3>Add Equipment</h3>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">Select equipment type:</option>
            <option value="4ftTarps">4ftTarps</option>
            <option value="6ftTarps">6ftTarps</option>
            <option value="8ftTarps">8ftTarps</option>
            <option value="chains">Chains</option>
            <option value="binders">Binders</option>
            <option value="pipeStakes">Pipe Stakes</option>
            <option value="other">Other</option>

          </select>
        </label>
        {type === 'other' && (
          <label>
            Other Type:
            <input
              type="text"
              value={onOtherType}
              onChange={(e) => setOnOtherType(e.target.value)}
              required
            />
          </label>
        )}
        <label>
          Quantity:
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} required />
        </label>
        <button type="submit">Add</button>
        <button type='button' onClick={(e)=>onHandleCancel(e)}>Cancel</button>

      </form>
    </Modal>
  );
};

export default AddEquipmentModal;