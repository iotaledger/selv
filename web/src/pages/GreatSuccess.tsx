import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { getCompanyId } from '../utils/helper'
import { RandomGraphicElement } from "../components";
import image1 from '../assets/greatSuccess/image1.png'
import image2 from '../assets/greatSuccess/image2.png'
import image3 from '../assets/greatSuccess/image3.png'
import checkmark from '../assets/checkmark.svg'
import dots from '../assets/backgrounds/dots.png'

/**
 * Component which will display a GreatSuccess.
 */
const GreatSuccess: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);
    const [companyId, setCompanyId] = useState('')

    useEffect(() => {
        async function determineCompanyId() {
            setCompanyId(await getCompanyId())
        } 
        determineCompanyId();
    }, [companyId])

    return (
        <RandomGraphicElement elements={7}>
            <div className="theme-demo">
                <div className="great-success">
                    <h2>Great Success!</h2>
                    <div className="great-success-content-wrapper">
                        <div className="great-success-content">
                            <div className="figure-wrapper">
                                <img className="figure" src={image1} alt="You signed in with DID" />
                            </div>
                            <div className="great-success-text-wrapper">
                                <span>
                                    <img src={checkmark} alt="" />
                                    <h3>You signed in with DID</h3>
                                </span>
                                <p>You managed to sign into a website you never signed up for. Account creation has been skipped saving you time and effort. The company house is also not burdened with saving your password.</p>
                            </div>
                        </div>
                        <div className="great-success-content" id="middle-item">
                            <div className="great-success-text-wrapper">
                                <span>
                                    <img src={checkmark} alt="" />
                                    <h3>Received new Credentials</h3>
                                </span>
                                <p>You became the owner of a company. From this point onwards, you would be able to prove your directorship position online, allowing you to act on behalf of the company. Overtime you can grow your Selv profile by gathering such credentials from trusted third parties.</p>
                            </div>
                            <div className="figure-wrapper">
                                <img className="figure" src={image2} alt="Received new Credentials" />
                            </div>
                        </div>
                        <div className="great-success-content">
                            <div className="figure-wrapper">
                                <img className="figure" src={image3} alt="You signed in with DID" />
                            </div>
                            <div className="great-success-text-wrapper">
                                <span>
                                    <img src={checkmark} alt="" />
                                    <h3>Re-used Selv Credentials</h3>
                                </span>
                                <p>By controlling your personal data, you shared verifiable data without having to type it into a form. You can use these same credentials in other processes. Imagine never having to type in your name, address, email etc...</p>
                            </div>
                        </div>
                    </div>
                    <div className="cta-wrapper">
                        <Link to={nextStep.replace(':companyId', companyId)}>
                            <Button className="cta">
                                Continue
                            </Button> 
                        </Link>
                    </div>
                </div>
                <img src={dots} alt="" className="dots-top" />
            </div>
        </RandomGraphicElement>
    );
}

export default GreatSuccess;