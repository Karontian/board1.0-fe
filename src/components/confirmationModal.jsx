import React from 'react'
import Modal from 'react-modal';
import './ConfirmationModal.css'

const ConfirmationModal = ({ isOpen, onRequestClose, message, onConfirm, onCancel }) => {
    return (
      <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal-content" overlayClassName="modal-backdrop">
        <h2>Confirmation</h2>
        <p>{message}</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>Cancel</button>
      </Modal>
    );
  };
  
  export default ConfirmationModal;