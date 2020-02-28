import React from 'react';
import { RandomGraphicElement } from '..'
import control from '../../assets/landing/benefits/control.svg' 
import privacy from '../../assets/landing/benefits/privacy.svg' 
import reusability from '../../assets/landing/benefits/reusability.svg' 
import laws from '../../assets/landing/benefits/laws.svg' 
import responsibility from '../../assets/landing/benefits/responsibility.svg' 
import user from '../../assets/landing/benefits/user.svg' 

export default () => (
    <RandomGraphicElement elements={10}>
        <div className="benefits-section" id="benefits">
            <h4 data-aos="fade-up">Benefits</h4>
            <h2 data-aos="fade-up">For users</h2>
            <div className="benefits-wrapper">
                <div className="benefit" data-aos="fade-up">
                    <img src={control} alt="Control" />
                    <h5>Control</h5>
                    <p>Anything related to your identity and your personal data remains in your control.</p>
                </div>
                <div className="benefit" data-aos="fade-up">
                    <img src={privacy} alt="Privacy" />
                    <h5>Privacy</h5>
                    <p>Improved privacy by only revealing the minimum amount of information.</p>
                </div>
                <div className="benefit" data-aos="fade-up">
                    <img src={reusability} alt="Reusability" />
                    <h5>Reusability</h5>
                    <p>Share as often as you like. No more typing in the same information repeatedly in online forms.</p>
                </div>
            </div>

            <h4 data-aos="fade-up">Benefits</h4>
            <h2 data-aos="fade-up">For business</h2>
            <div className="benefits-wrapper">
                <div className="benefit" data-aos="fade-up">
                    <img src={laws} alt="Privacy Laws" />
                    <h5>Privacy Laws</h5>
                    <p>Complies to the strictest interpretation of the General Data Protection Act (GDPR).</p>
                </div>
                <div className="benefit" data-aos="fade-up">
                    <img src={responsibility} alt=" Data Responsibility" />
                    <h5>Data Responsibility</h5>
                    <p>Users can present or consent, removing responsibility on data protection from the company.</p>
                </div>
                <div className="benefit" data-aos="fade-up">
                    <img src={user} alt="User Experience" />
                    <h5>User Experience</h5>
                    <p>Retain more customers through an enhanced User Experience. Less manual typing required.</p>
                </div>
            </div>
        </div>
    </RandomGraphicElement>
);