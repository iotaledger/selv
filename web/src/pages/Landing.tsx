import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'rsuite';

/**
 * Component which will display a Landing.
 */
const Landing: React.FC = () => {
    return (
        <div className="page-wrapper">
            <div className="main-section">
                <h1>Landing Page</h1>
                <Link to="/progress/intro/2">
                    <Button size="lg">
                        Start Demo
                    </Button> 
                </Link>
            </div>
        </div>
    );
}

export default Landing;