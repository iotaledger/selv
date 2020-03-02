import React, { useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import { RandomGraphicElement } from '../components'
import useStep from "../utils/useStep";
import howItWorks from '../assets/landing/howItWorks1.png' 

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 
    
    useEffect(() => {
        const reset = async () => await localStorage.clear()
        reset()
    }, [])

    return (
        <RandomGraphicElement elements={7}>
            <div className="theme-demo">
                <div className="demo-intro">
                    <h2>Welcome to the <span className="highlight">Selv demo</span></h2>
                    <h3>Here is <strong>your to-do list</strong> for today:</h3>
                    <ul className="todos">
                        <li>Set up a company</li>
                        <li>Get a bank account</li>
                        <li>Get liability insurance</li>
                    </ul>
                    <Link to={nextStep}>
                        <Button className="cta">
                            Continue
                        </Button> 
                    </Link>
                </div>
                <img src={howItWorks} alt="how It Works" className="howItWorks" />
            </div>
        </RandomGraphicElement>
    );
}

export default IntroShowTodos;