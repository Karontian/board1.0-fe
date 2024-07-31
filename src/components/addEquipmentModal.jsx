import React, { useState } from 'react';
import Modal from 'react-modal';

const AddEquipmentModal = ({ isOpen, onRequestClose, onSubmit, currentDriverId }) => {
  const [type, setType] = useState('');
  const [qty, setQty] = useState('');
  const [onOtherType, setOnOtherType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalType = type === 'Other' ? onOtherType : type;
    onSubmit(finalType, qty);
    onRequestClose();
    setType('');
    setQty('');
    setOnOtherType('');
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>DriverID#: {currentDriverId}</h2>
      <form onSubmit={handleSubmit}>
        <h3>Add Equipment</h3>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">Select equipment type:</option>
            <option value="Type1">Type1</option>
            <option value="Type2">Type2</option>
            <option value="Type3">Type3</option>
            <option value="Other">Other</option>
          </select>
        </label>
        {type === 'Other' && (
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
      </form>
    </Modal>
  );
};

export default AddEquipmentModal;