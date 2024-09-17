import React, { useState } from 'react';
import Modal from 'react-modal';

const DispatcherModal = ({ isOpen, onRequestClose, currentDispatchers, onConfirm, onCancel }) => {
    const [selectedDispatcher, setSelectedDispatcher] = useState('');

    const handleConfirm = () => {
        onConfirm(selectedDispatcher);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal-content" overlayClassName="modal-backdrop">
            <h2>Select new dispatcher</h2>
            <select value={selectedDispatcher} onChange={(e) => setSelectedDispatcher(e.target.value)}>
                <option value="" disabled>Select a dispatcher</option>
                {currentDispatchers.map((dispatcher, index) => (
                    <option key={index} value={dispatcher}>{dispatcher}</option>
                ))}
            </select>
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={onCancel}>Cancel</button>
        </Modal>
    );
};

export default DispatcherModal;