import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import { getCompanyId } from '../utils/helper'
import useStep from "../utils/useStep";
import { Layout, RandomGraphicElement } from "../components";
import selv from '../assets/selvSuccessBordered.svg'

/**
 * Component which will display a Confirmation.
 */
const Confirmation: React.FC = ({ match }: any) => {
    const { nextStep, theme } = useStep(match);
    const [companyId, setCompanyId] = useState('')
    const [title, setTitle] = useState('')

    useEffect(() => {
        async function determineCompanyId() {
            setCompanyId(await getCompanyId())
            switch (theme) {
                case 'bank':
                    setTitle('Your business bank account is now set up!')
                    break;
                case 'insurance':
                    setTitle('Congratulations, your liability insurance is now set up!')
                    break;
                case 'company':
                default:
                    setTitle('Congratulations, your company is now set up!')
                    break;
            }
        } 
        determineCompanyId();
    }, [companyId, theme])

    return (
        <Layout match={match}>
            <RandomGraphicElement elements={5}>
                <div className="confirmation-page">
                    <div className="selv-wrapper">
                        <img src={selv} alt="Selv app logo" />
                        <h4>Your new credential is sent to Selv</h4>
                    </div>
                    <h2>{title}</h2>
                    {
                        theme === 'company' &&
                            <p>You are now the proud owner of your new company. From now on you’ll be able to prove that you have a directorship position at your newly found company. Open up Selv in order to receive a signed credential you can use to act on behalf of your company.</p>
                    }
                    <Link to={nextStep.replace(':companyId', companyId)}>
                        <Button>
                            {
                                theme === 'company' ? 'Continue' : 'Return to Company House'
                            }
                        </Button> 
                    </Link>
                </div>
            </RandomGraphicElement>
        </Layout>
    );
}

export default Confirmation;
