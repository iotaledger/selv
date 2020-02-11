import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout } from "../components";
import mobile from '../assets/mobile.svg'

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 
    
    return (
        <Layout match={match}>
            <React.Fragment>
                <h2>Looks like a lot of work,<br />unless Bob is using Selv 🧐</h2>
                <img src={mobile} alt="Mobile phone" />
                <Link to={nextStep}>
                    <Button type="primary">
                        Let's do it 
                    </Button> 
                </Link>
            </React.Fragment>
        </Layout>
    );
}

export default IntroShowTodos;