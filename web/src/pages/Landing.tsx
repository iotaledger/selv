import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';

/**
 * Component which will display a Landing.
 */
const Landing: React.FC = () => {
    return (
        <div className="theme-demo page-wrapper">
            <div className="main-section">
                <h1>Landing Page</h1>
                <Link to="/progress/intro/todos/2">
                    <Button type="primary">
                        Start Demo
                    </Button> 
                </Link>
            </div>
        </div>
    );
}

export default Landing;