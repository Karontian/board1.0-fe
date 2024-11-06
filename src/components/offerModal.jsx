import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios'

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

    const onOfferSave = async (e, status, data) => {
        e.preventDefault();
        console.log('OFFER SAVED', status, data);
        // CALL TO UPDATE CURRENT DRIVER LOCATION
        if (status === 'accepted') {
            try {
                const comment = `*${offeredDriver} accepts load offer to ${data.location} on ${data.date} @ ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
                console.log('ACCEPTED', data.location, data.date, comment)
                const updateCall = await axios.put(`https://illustrious-dusk-6a3872.netlify.app/.netlify/functions/app/driverOfferAccepted/${offeredDriver}`, {
                    location: data.location,
                    date: data.date,
                    comment: comment
                });
                setOfferAccepted(null);

            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                console.log('REJECTED', data)
                const systemComment = `* ${offeredDriver} rejects load offer  @ ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                const  updateCall = await axios.put(`https://illustrious-dusk-6a3872.netlify.app/.netlify/functions/app/driverOfferRejected/${offeredDriver}`, {
                    comment: 'Comment: '+ data.comment,
                    sysComment: systemComment
                })
                console.log('DB UPDATED', updateCall)        
                setOfferAccepted(null);

            } catch (err) {
                // Handle error for else logic here
            }
        }
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
                                    <button onClick={e => onOfferSave(e, 'accepted', { location, date})}>Save</button>
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