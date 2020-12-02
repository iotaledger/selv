import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

export default ({ nextStep }) => (
    <div className='next-step-drawer completed'>
        <h3>Your pledges are complete</h3>
        <p>You can now commit your pledges to generations</p>
        <Link to={nextStep}>
            <Button>
                Commit
            </Button>
        </Link>
    </div>
);
