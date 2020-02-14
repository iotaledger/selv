import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout } from "../components";
import image1 from '../assets/greatSuccess/image1.svg'
import image2 from '../assets/greatSuccess/image2.svg'
import image3 from '../assets/greatSuccess/image3.svg'
import checkmark from '../assets/greatSuccess/checkmark.svg'

/**
 * Component which will display a GreatSuccess.
 */
const GreatSuccess: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 

    return (
        <Layout match={match}>
            <div className="great-success">
                <h1>Great Success!</h1>
                <div className="great-success-content-wrapper">
                    <div className="great-success-content">
                        <img className="figure" src={image1} alt="You signed in with DID" />
                        <div className="great-success-text-wrapper">
                            <span>
                                <img src={checkmark} alt="" />
                                <h3>You signed in with DID</h3>
                            </span>
                            <p>You managed to sign into a website you never signed up for. Account creation has been skipped saving you time and effort. The company house is also not burdened with saving your password.</p>
                        </div>
                    </div>
                    <div className="great-success-content">
                        <img className="figure" src={image2} alt="Received new Credentials" />
                        <div className="great-success-text-wrapper">
                            <span>
                                <img src={checkmark} alt="" />
                                <h3>Received new Credentials</h3>
                            </span>
                            <p>You became the owner of a company. From this point onwards, you would be able to prove your directorship position online, allowing you to act on behalf of the company. Overtime you can grow your Selv profile by gathering such credentials from trusted third parties.</p>
                        </div>
                    </div>
                    <div className="great-success-content">
                        <img className="figure" src={image3} alt="You signed in with DID" />
                        <div className="great-success-text-wrapper">
                            <span>
                                <img src={checkmark} alt="" />
                                <h3>Re-used Selv Credentials</h3>
                            </span>
                            <p>By controlling your personal data, you shared verifiable data without having to type it into a form. You can use these same credentials in other processes. Imagine never having to type in your name, address, email etc...</p>
                        </div>
                    </div>
                </div>
                <Link to={nextStep}>
                    <Button>
                        Continue
                    </Button> 
                </Link>
            </div>
        </Layout>
    );
}

export default GreatSuccess;