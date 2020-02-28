import React from 'react';
import logo from '../../assets/landing/logoBody.svg' 

export default () => (
    <div className="selv-section">
        <img data-aos="fade-up" src={logo} alt="Selv logo" />
        <p data-aos="fade-up">Your data shouldn’t be public, but it shouldn’t be locked up either.<br />We promise a solution that <strong>enables data flow</strong>, completely in your <strong>control</strong>.</p>
    </div>
);