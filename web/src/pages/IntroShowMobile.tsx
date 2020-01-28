import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'rsuite';
import useStep from "../utils/useStep";
import mobile from '../assets/mobile.svg'

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 
    
    return (
        <div className="page-wrapper">
            <div className="main-section">
                <h2>Looks like a lot of work,<br />unless Bob is using DIDI 🧐</h2>
                <img src={mobile} alt="Mobile phone" />
                <Link to={nextStep}>
                    <Button size="lg">
                        Let's do it 
                    </Button> 
                </Link>
            </div>
        </div>
    );
}

export default IntroShowTodos;