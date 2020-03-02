import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import mobile from '../assets/mobile.png'
import { RandomGraphicElement } from '../components'

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 
    
    return (
        <RandomGraphicElement elements={7}>
            <div className="theme-demo">
                <div className="demo-intro">
                    <h1>That looks like a lot of work...</h1>
                    <h3>But using IOTA’s Unified Identity Protocol and the Selv app, it will be <strong>​quick and easy​.</strong></h3>
                    <Link to={nextStep}>
                        <Button className="cta">
                            Let's do it 
                        </Button> 
                    </Link>
                </div>
                <img className="phone" src={mobile} alt="Mobile phone" />
                <p className="note">This demo can be best experienced using the browser on a PC in combination with the Selv app on your phone. A full phone experience is possible using the mobile browser and the Selv app.</p>
            </div>
        </RandomGraphicElement>
    );
}

export default IntroShowTodos;