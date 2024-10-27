import React from 'react';
import './footer.css'; // Make sure to create and import the CSS file

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>About Us</h4>
                    <p>We are a company dedicated to providing the best services to our clients. Our mission is to deliver high-quality solutions that meet your needs.</p>
                </div>
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>Email: info@company.com</p>
                    <p>Phone: (123) 456-7890</p>
                    <p>Address: 123 Main St, Anytown, USA</p>
                </div>
                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2023 Company Name. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Footer;