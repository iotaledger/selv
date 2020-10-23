import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

export default ({ link }: { link: string }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        async function setInfo () {
            const healthAuthorityStatus = await localStorage.getItem('healthAuthority');

            if (!healthAuthorityStatus || healthAuthorityStatus !== 'completed') {
                setShow(true);
            }
        }
        setInfo();
    }, []);

    if (!show || !link) {
        return <React.Fragment />;
    }

    return (
        <div className='next-step-drawer'>
            <h3>Add your credential to the Selv App</h3>
            <p>
                Download your health credential
            </p>
            <Link to={link}>
                <Button>
                    Continue
                </Button>
            </Link>
        </div>
    );
};
