import React, { useState, useEffect } from 'react';
import cookies from 'js-cookie';
import { Button } from 'antd';

const Disclaimer = () => {
	const [ack, setAck] = useState(false);

	useEffect(() => {
		const ack = cookies.get('covid-cookie');
		if (ack) {
			setAck(true);
		} else if ((!ack || ack !== 'true') && document) {
			const element = document.getElementById('footer') || document.getElementById('app');
			const elementDownloadApp = document.getElementById('app-download');
			if (element || elementDownloadApp) {
				element && element.classList.add('cookie-bar-bottom-bar');
                elementDownloadApp && elementDownloadApp.classList.add('cta-section-extended');
                setAck(false);   
            }
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	function dismiss() {
		cookies.set('covid-cookie', 'true', { expires: 365 });
		if (document) {
			const element = document.getElementById('footer') || document.getElementById('app');
			const elementDownloadApp = document.getElementById('app-download');
			if (element || elementDownloadApp) {
                element && element.classList.remove('cookie-bar-bottom-bar');
                elementDownloadApp && elementDownloadApp.classList.remove('cta-section-extended');
                elementDownloadApp && elementDownloadApp.classList.add('cta-section');
                setAck(true);
            }
		}
	}

	if (ack) return null;

	return (
		<div className='disclaimer-wrapper'>
			<span className='disclaimer-text'>
				This website uses cookies and local storage to ensure you get the best experience on our website.&nbsp;
				<a
					className='disclaimer-link'
					target='_blank'
					rel='noopener noreferrer'
					href='https://www.iota.org/research/privacy-policy'>
					Learn more
				</a>
			</span>
			<Button className='cta' onClick={dismiss}>
				Dismiss
			</Button>
		</div>
	);
};

export default Disclaimer;
