import React, { useState } from 'react';
import Modal from 'react-modal';

import './offerModal.css';

const OfferModal = ({ isOpen, onRequestClose, offeredDriver }) => {
    const [offerAccepted, setOfferAccepted] = useState(null);
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [comment, setComment] = useState('');

    const onYes = () => {
        setOfferAccepted('yes');
    };

    const onNo = () => {
        setOfferAccepted('no');
    };

    const onOfferSave = (e, status, data) => {
        e.preventDefault();
        console.log('OFFER SAVED', status, data);
        // CALL TO UPDATE CURRENT DRIVER LOCATION
        setOfferAccepted(null);
        setLocation('');
        setDate('');
        setComment('');
        onRequestClose()
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal-content" overlayClassName="modal-backdrop">
            <h2>Was the offer accepted?</h2>
            <div id='offerSelection'>
                <button onClick={onYes} disabled={offerAccepted !== null}>Yes</button>
                <button onClick={onNo} disabled={offerAccepted !== null}>No</button>
                {offerAccepted !== null && (
                    offerAccepted === 'yes' ?  // OFFER IS ACCEPTED
                    (
                        <div id='offerFormAccepted'>
                            <h3>Next Available Location and Date</h3>
                            <form>
                                <h1>Offer accepted, driverID: {offeredDriver}</h1>
                                <div>
                                    <label htmlFor="location">Next Available Location:</label>
                                    <input 
                                        type="text" 
                                        id="location" 
                                        name="location" 
                                        value={location} 
                                        onChange={(e) => setLocation(e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="date">Date:</label>
                                    <input 
                                        type="date" 
                                        id="date" 
                                        name="date" 
                                        value={date} 
                                        onChange={(e) => setDate(e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <button onClick={e => onOfferSave(e, 'accepted', { location, date })}>Save</button>
                                </div>
                            </form>
                        </div>
                    ) 
                    : 
                    (
                        <div id='offerFormRejected'>
                            <h3>Comments for rejection:</h3>
                            <form>
                                <input 
                                    type="text" 
                                    value={comment} 
                                    onChange={(e) => setComment(e.target.value)} 
                                />
                                <button onClick={e => onOfferSave(e, 'rejected', { comment })}>Save</button>
                            </form>
                        </div>
                    )
                )}
            </div>
        </Modal>
    );
};

export default OfferModal;