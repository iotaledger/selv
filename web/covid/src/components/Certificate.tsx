import React from 'react';
import background from '../assets/certificateCheck.svg';

interface IData {    
    FirstName?: string;
    LastName?: string;
    Date?: string;
    IdentityCardNumber?: string;
    timestamp?: number;
    testId?: string;
    testResult?: string;
    testedBy?: string;
    testKit?: string;
}

const Certificate = ({ data }: { data: IData }) => (
    <div className="certificate-wrapper">
        <h4 className='certificate-section-header'>Test {data?.testId}</h4>
        <TestData details={data}/>
        <h4 className='certificate-section-header'>Patient details</h4>
        <PersonalData details={data}/>
        <img src={background} alt='' />
    </div>
);

const TestData = ({ details }: { details: IData | undefined }) => {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    
    return (
        <div className="details-section">
            <div className='details-item'>
                <p>Tested by</p>
                <p className='bold'>{details?.testedBy}</p>
            </div>
            <div className='details-item'>
                <p>Test kit</p>
                <p className='bold'>{details?.testKit}</p>
            </div>
            <div className='details-item'>
                <p>Taken on</p>
                <p className='bold'>
                    {(new Date(details?.timestamp || Date.now())).toLocaleDateString('en-GB', dateOptions)}
                </p>
            </div>
            <div className='details-item'>
                <p>Test result</p>
                <p className='bold'>{details?.testResult}</p>
            </div>
        </div>
    );
};

const PersonalData = ({ details }: { details: IData | undefined }) => {
    return (
        <div className="details-section">
            <div className='details-item'>
                <p>First name</p>
                <p className='bold'>{details?.FirstName}</p>
            </div>
            <div className='details-item'>
                <p>Last name</p>
                <p className='bold'>{details?.LastName}</p>
            </div>
            <div className='details-item'>
                <p>Date of birth</p>
                <p className='bold'>{details?.Date}</p>
            </div>
            <div className='details-item'>
                <p>ID number</p>
                <p className='bold'>{details?.IdentityCardNumber}</p>
            </div>
        </div>
    );
};

export default Certificate;
