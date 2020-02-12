import React, { useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout } from "../components";

/**
 * Component which will display a SingInConfirmation.
 */
const SingInConfirmation: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 

    useEffect(() => {
        async function getData() {
            const credentialsString: string | null = await localStorage.getItem('credentials')
            const credentials = credentialsString && await JSON.parse(credentialsString)
            const status = credentials?.status
            if (!status || Number(status) !== 2) {
                console.log('Credentials missing or not trusted')
                history.goBack()
            }
        } 
        getData()
    }, [])

    return (
        <Layout match={match}>
            <div className="sign-in-confirmation">
                <h3>Hello, Bob!</h3>
                <Link to={nextStep}>
                    <Button>
                        Set up a new company
                    </Button> 
                </Link>
            </div>
        </Layout>
    );
}

export default SingInConfirmation;