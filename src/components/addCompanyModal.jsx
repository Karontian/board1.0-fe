import React, { useState } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import './addCompanyModal.css'

const AddCompanyModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [companyName, setCompanyName] = useState('');
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
  const [mcNumber, setMcNumber] = useState('');
  const [dotNumber, setDotNumber] = useState('');
  const [einNumber, setEinNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      companyName,
      companyPhoneNumber,
      mcNumber,
      dotNumber,
      einNumber,
      ownerName,
      ownerPhoneNumber,
      address,
    });
    toast.success("Company added successfully");
    onRequestClose();
    setCompanyName('');
    setCompanyPhoneNumber('');
    setMcNumber('');
    setDotNumber('');
    setEinNumber('');
    setOwnerName('');
    setOwnerPhoneNumber('');
    setAddress('');
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onRequestClose();
    setCompanyName('');
    setCompanyPhoneNumber('');
    setMcNumber('');
    setDotNumber('');
    setEinNumber('');
    setOwnerName('');
    setOwnerPhoneNumber('');
    setAddress('');
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal-content" >
      <h2>Add a New Company</h2>
      <form onSubmit={handleSubmit}>
        <label> 
          Company Name:
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter a company name"
            required
          />
        </label>
        <label>
          Company Phone#:
          <input
            type="number"
            value={companyPhoneNumber}
            onChange={(e) => setCompanyPhoneNumber(e.target.value)}
            placeholder="xxx - xxx - xxxx"
            required
          />
        </label>
        <label>
          MC#:
          <input
            type="number"
            value={mcNumber}
            onChange={(e) => setMcNumber(e.target.value)}
            placeholder="Enter an MC#"
            required
          />
        </label>
        <label>
          DOT#:
          <input
            type="number"
            value={dotNumber}
            onChange={(e) => setDotNumber(e.target.value)}
            placeholder="Enter a DOT#"
            required
          />
        </label>
        <label>
          EIN#:
          <input
            type="number"
            value={einNumber}
            onChange={(e) => setEinNumber(e.target.value)}
            placeholder="Enter an EIN#"
            required
          />
        </label>
        <label>
          Company Owner:
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Owner Name"
            required
          />
        </label>
        <label>
          Owner Phone#:
          <input
            type="number"
            value={ownerPhoneNumber}
            onChange={(e) => setOwnerPhoneNumber(e.target.value)}
            placeholder="xxx - xxx - xxxx"
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Company registered address"
            required
          />
        </label>
        <button type="submit">Add</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
      <ToastContainer/>

    </Modal>
  );
};

export default AddCompanyModal;