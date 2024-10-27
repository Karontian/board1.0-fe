import React, { useState } from 'react';
import Modal from 'react-modal';

const DateForceChangeModal = ({ isOpen, onRequestClose, onConfirm, onCancel }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [comment, setComment] = useState('');
    const [newLocation, setNewLocation] = useState('')


    const handleConfirm = () => {
        onConfirm(selectedDate, comment, newLocation);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal-content" overlayClassName="modal-backdrop">
            <h2>Select a date</h2>
            <label htmlFor="forceDateChangeNewDate">New Date: </label>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                name='forceDateChangeNewDate'
            />
            <br />
            <label htmlFor="forceDateChangeComments">Force Date Change comments: </label>
            <input 
                type="text" 
                name='forceDateChangeComments'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <br />
            <label htmlFor="forceDateChangeLocation"> New location:
                <input type="text"
                        name='forceDateChangeLocation'
                        value={newLocation}
                        onChange={(e)=> setNewLocation(e.target.value)}  />
            </label>
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={onCancel}>Cancel</button>
        </Modal>
    );
};

export default DateForceChangeModal;