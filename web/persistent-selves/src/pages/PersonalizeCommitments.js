import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, RandomGraphicElement } from '../components';
import selv from '../assets/selvBordered.svg';
import image from '../assets/greatSuccess/image1.png';

/**
 * Component which will display a PersonalizeCommitments.
 */
const PersonalizeCommitments = ({ history, match }) => {
    const { nextStep } = useStep(match);

    const commitments = history?.location?.state?.commitments;
    console.log(444, commitments)
    // useEffect(() => {
    //     async function getData () {
    //         const credentialsString = await localStorage.getItem('credentials');
    //         const credentials = credentialsString && await JSON.parse(credentialsString);
    //         const status = credentials?.status;
    //         if (!status || Number(status) !== 2) {
    //             history.goBack();
    //         }
    //     }
    //     getData();
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Layout match={match}>

        </Layout>
    );
};

export default PersonalizeCommitments;
