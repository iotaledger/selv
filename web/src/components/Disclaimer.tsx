import React, { useState, useEffect } from 'react';
import { withCookies } from 'react-cookie';
import { Button } from 'antd';

// import '../assets/styles/disclaimer.scss'

const Disclaimer = ({ cookies }: { cookies: any }) => {
    const [ack, setAck] = useState(true);

    useEffect(() => {
        const ack = cookies.get('selv-cookie');
        if (!ack && document) {
            const element = document.getElementById('footer');
            if (element) {
                element.classList.add('cookie-bar-bottom-bar');
                setAck(false);
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function dismiss () {
        cookies.set('selv-cookie', true, { path: '/' });
        if (document) {
            const element = document.getElementById('footer');
            if (element) {
                element.classList.remove('cookie-bar-bottom-bar');
                setAck(true);
            }
        }
    }

    if (ack) return null;

    return (
        <div className='disclaimer-wrapper'>
            <span className='disclaimer-text'>
        This website uses cookies to ensure you get the best experience on our
        website.&nbsp;
                <a
                    className='disclaimer-link'
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://www.iota.org/research/privacy-policy'
                >
          Learn more
                </a>
            </span>
            <Button className='primary' onClick={dismiss}>Dismiss</Button>
        </div>
    );
};

export default withCookies(Disclaimer);
