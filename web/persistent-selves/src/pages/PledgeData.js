import React, { useState, useEffect } from 'react';
import { Button, Card, notification } from 'antd';
import { flattenObject } from '../utils/helper';
import useStep from '../utils/useStep';
import { Layout, Loading, PrefilledForm, WebSocket } from '../components';
const prefilledFields = [
    'FirstName',
    'LastName',
    'Date',
    'Nationality',
    'Country',
    'Phone'
];

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
    const [commitments, setCommitments] = useState({});
    const { theme } = useStep(match);

    useEffect(() => {
        async function loadCommitments() {
            try {
                if (theme) {
                    const storedCommitments = await localStorage.getItem(theme);
                    storedCommitments && setCommitments(JSON.parse(storedCommitments));
                }
            } catch (err) {
                console.error('Error while loading commitments', err);
            }
        }
    
        loadCommitments();
    }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

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

    const processValues = () => {
        const fields = Object.values(commitments).map(commitment => ({
            CommitmentId: commitment?.commitmentId,
            CommitmentTitle: commitment?.title,
            CommitmentPercentage: commitment?.percentage,
            CommitmentSupport: commitment?.support,
            CommitmentWalletPercentage: commitment?.walletPercentage
        }))
        setFields({ Commitments: fields });
        setWebSocket(true);
    }

    const setStatusMessage  = message => {
        setStatus(message);
    }

    const prefilledFormData = { dataFields: prefilledData };

    return (
        <Layout match={match} noFooter>
            <div className='commitments-data-page-wrapper'>
                <div className='commitments-wrapper'>
                    <h2>Summary</h2>
                    <div className='commitments-cards-wrapper'>
                    {
                        Object.values(commitments).map(commitment => (
                            <div 
                                className='form-commitment-wrapper' 
                                key={commitment?.commitmentId}
                            >
                                <h4>{commitment?.title}</h4>
                                <Card 
                                    bordered
                                    hoverable={false}
                                    className='form-commitment-card'
                                >
                                    <div className='form-commitment-content'>
                                        {
                                            theme === 'future' ? (
                                                <p>
                                                    <b>{commitment?.condition?.replace(/ .*/, '')} </b>
                                                    {commitment?.condition?.split(' ').slice(1).join(' ')}
                                                    <span className='custom-value'> {commitment?.percentage} </span>
                                                    THEN donate <span className='custom-value'>{commitment?.walletPercentage}%</span> of my wallet
                                                    balance TO support <span className='custom-value'>{commitment?.support}</span>
                                                </p>
                                            ) : (
                                                <p>
                                                    <b>I commit to </b>
                                                    <span className='custom-value'>{commitment?.support}</span>
                                                </p>
                                            )
                                        }

                                    </div>
                                </Card>
                            </div>
                        ))
                    }
                    </div>
                    <div className='form-wrapper'>
                        {
                            Object.keys(prefilledFormData.dataFields).length &&
                            <PrefilledForm {...prefilledFormData} />
                        }
                        <div className='btn-wrapper'>
                            <Button onClick={processValues}>
                                <h4>Confirm my legacy</h4>
                            </Button>
                        </div>
                        <br />
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
                                schemaName={theme === 'future' ? 'FutureCommitments' : 'PresentCommitments'}
                                setStatus={setStatusMessage}
                                fields={fields}
                            />
                        }
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PledgeData;
