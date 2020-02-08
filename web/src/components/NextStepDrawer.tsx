import React from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'antd';

export default ({ link }: { link: string }) => (
    <div className="next-step-drawer">
        <h3>Your company is not Active yet</h3>
        <p>
            You need to add Bank Account and Liability Insurance to finish this process
        </p>
        <Link to={link}>
            <Button>
                Open bank account
            </Button> 
        </Link>
    </div>
);