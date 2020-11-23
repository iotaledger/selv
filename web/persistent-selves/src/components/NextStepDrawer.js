import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

export default ({ link }) => {
    const [nextStep, setNextStep] = useState('');

    useEffect(() => {
        async function setInfo () {
            const companyHouse = await localStorage.getItem('companyHouse');
            const bank = await localStorage.getItem('bank');
            const insurance = await localStorage.getItem('insurance');
            if (insurance && insurance === 'completed') {
                setNextStep('completed');
            } else if (bank && bank === 'completed') {
                setNextStep('insurance');
            } else if (companyHouse && companyHouse === 'completed') {
                setNextStep('bank');
            }
        }
        setInfo();
    }, []);

    if (!link) {
        return <React.Fragment />;
    }

    switch (nextStep) {
        case 'completed':
            return (
                <div className='next-step-drawer completed'>
                    <h3>Your company is now Active</h3>
                    <p>
                        You have successfully set up your entire business. This is the end of this demo and we thank you for participating. Selv will be updated with more demonstrations and will be updated with more features
                    </p>
                    <Link to={link}>
                        <Button>
                                Finish demo
                        </Button>
                    </Link>
                </div>
            );
        case 'insurance':
            return (
                <div className='next-step-drawer'>
                    <h3>Your company is not Active yet</h3>
                    <p>
                        You need to add Liability Insurance to finish this process
                    </p>
                    <Link to={link}>
                        <Button>
                            Get insurance
                        </Button>
                    </Link>
                </div>
            );
        case 'bank':
            return (
                <div className='next-step-drawer'>
                    <h3>Your company is not Active yet</h3>
                    <p>
                        You need to add Bank Account and Liability Insurance to finish this process
                    </p>
                    <Link to={link}>
                        <Button>
                            Open bank account
                        </Button>
                    </Link>
                </div>
            );
        default:
            return <React.Fragment />;
    }
};
