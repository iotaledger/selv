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
            <div className="demo-intro">
                <div className="app">
                    <h1>That looks like a lot of work...</h1>
                    <h3>It’s a pretty long to-do list for today, but using IOTA’s Unified Identity Protocol and the Selv app,  it will be ​quick and easy​.</h3>
                    <div className="info">
                        <p>This demo can be best experienced using the browser on a PC in combination with the Selv app on your phone. A full phone experience is possible using the mobile browser and the Selv app.</p>
                        
                        <Link to={nextStep}>
                            <Button type="primary">
                                Let's get started 
                            </Button> 
                        </Link>
                    </div>
                    <img className="phone" src={mobile} alt="Mobile phone" />
                </div>
            </div>
        </Layout>
    );
}

export default IntroShowTodos;