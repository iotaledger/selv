import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { flattenObject } from '../utils/helper';
import { Layout, Loading, Form, PrefilledForm, WebSocket } from '../components';

const prefilledFields = [
    'FirstName',
    'LastName',
    'Date',
    'Nationality',
    'Country',
    'Phone'
];

const emptyFields = [
    'CompanyName',
    'CompanyAddress',
    'CompanyType',
    'CompanyBusiness'
];

const labels = {
    CompanyName: 'Company name',
    CompanyAddress: 'Company address',
    CompanyType: 'Company type',
    CompanyBusiness: 'Nature of business'
};

const messages = {
    waiting: 'Waiting for Selv app...',
    connectionError: 'Connection error. Please try again!',
    missing: 'Credentials missing or not trusted'
};

const notify = (type, message, description) => {
    return type === 'error'
        ? notification.error({ message, description })
        : notification.warning({ message, description });
};

/**
 * Component which will display a PledgeData.
 */
const PledgeData = ({ history, match }) => {
    const [webSocket, setWebSocket] = useState(false);
    const [fields, setFields] = useState();
    const [status, setStatus] = useState('');
    const [prefilledData, setPrefilledData] = useState({});

    useEffect(() => {
        async function getData () {
            const credentialsString = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!status || Number(status) !== 2) {
                notify('error', 'Error', messages.connectionError);
                history.goBack();
            }
            const flattenData = flattenObject(credentials?.data);
            const address = { Address: `${flattenData.Street} ${flattenData.House}, ${flattenData.City}, ${flattenData.Country}, ${flattenData.Postcode}` };
            const result = prefilledFields.reduce((acc, entry) =>
                ({ ...acc, [entry]: flattenData[entry] }), {});

            setPrefilledData({ ...result, ...address });
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function processValues (fields) {
        setFields(fields);
        setWebSocket(true);
    }

    function setStatusMessage (message) {
        setStatus(message);
    }

    const prefilledFormData = { dataFields: prefilledData };
    const emptyFormData = { dataFields: emptyFields, labels, processValues, status, messages };

    return (
        <Layout match={match}>
            <div className='company-data-page-wrapper'>
                <h2>Set up a private limited company</h2>
                <h3 className='section-header'>Business owner</h3>
                {
                    Object.keys(prefilledFormData.dataFields).length &&
                    <PrefilledForm {...prefilledFormData} />
                }

                <h3 className='section-header'>Company Details</h3>
                <Form {...emptyFormData} />
                {
                    status && (
                        <div className='loading'>
                            <p className='bold'>{status}</p>
                            {
                                status === messages.waiting && <Loading />
                            }
                        </div>
                    )
                }
                {
                    webSocket && <WebSocket
                        history={history}
                        match={match}
                        schemaName='Company'
                        setStatus={setStatusMessage}
                        fields={fields}
                    />
                }
            </div>
        </Layout>
    );
};

export default PledgeData;
