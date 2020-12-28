import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Space } from 'antd';
import { Modal, RandomGraphicElement, Stats } from '../components';
import image1 from '../assets/thankYou/image1.svg';
import image2 from '../assets/thankYou/image2.svg';
import image3 from '../assets/thankYou/image3.svg';
import image4 from '../assets/thankYou/image4.svg';
import checkmark from '../assets/checkmark.svg';
import logo from '../assets/landing/logoHeader.svg';
import dots from '../assets/backgrounds/dots.png';
import { Footer } from '../components/landing';
import { cards } from '../assets/commentary';

/**
 * Component which will display a ThankYou.
 */
const ThankYou = ({ history }) => {
	const [commentary, setCommentary] = useState(null);

	useEffect(() => {
        async function getData () {
            const credentialsString = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!status || Number(status) !== 2) {
                history.goBack();
            }
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className='theme-demo'>
			<Link to={'/'} className='logo demo-page'>
				<img src={logo} alt='Selv logo' />
			</Link>
			<div className='thank-you-page-wrapper'>
				<RandomGraphicElement elements={7}>
					<div className='thank-you-wrapper-2'>
						<span className='heading'>
							<Space size='small'>
								<h2 className='highlight'>Your</h2>
								<h2>legacy</h2>
							</Space>
							<Space size='small'>
								<h2>for</h2>
								<h2 className='highlight'>future</h2>
							</Space>
							<Space size='small'>
								<h2>generations</h2>
								<h2 className='highlight' />
							</Space>
						</span>
						<div className='thank-you-content'>
							<div className='figure-wrapper'>
								<img className='figure' src={image4} alt='goodbye' />
							</div>
							<div className='thank-you-text-wrapper'>
								<Space direction='vertical' size='large'>
									<h3>Thank you.</h3>
									<p>
										Being a Good Ancestor, you have made a commitment to act according to the values you think are best in
										the present moment.
									</p>
									<p>
										Your digital commitments will be public to future generations as a testament of the legacy you have
										created.
									</p>
									<p>
										Your environmental footprint will contribute towards a healthier environment for generations to come.
									</p>
								</Space>
							</div>
						</div>
					</div>
					<div className='commentary-wrapper'>
						<Space direction='vertical' size='large'>
							<h3>Commentary</h3>
							<span className='heading'>
								<h2>Your</h2>&nbsp;&nbsp;<h2 className='highlight'>Persistent</h2>&nbsp;&nbsp;<h2>Selv</h2>
							</span>
							<p>
								Read expert commentary from reknowned industry thinkers and how Selv is helping to educate on Futures
								Literacy for the benefit of all
							</p>
						</Space>
						<div className='commentary-cards-wrapper'>
							{
								cards.map(card => (
									<div className='commentary-card' key={card?.id}>
										<div className='card-logo-wrapper'>
											<img className='figure' src={card?.image} alt='' />
										</div>
										<div className='commentary-card-content'>
											<h5>{card?.title}</h5>
											<p>{card?.body}</p>
											<div className='btn-wrapper'>
												<button onClick={() => setCommentary(card?.id)}>Read commentary</button>
											</div>
										</div>
									</div>
								))
							}
						</div>
					</div>
					<Stats />
					<div className='thank-you-wrapper'>
						<Space direction='vertical' size='large' className='heading-wrapper'>
							<h3>Demo complete</h3>
							<span className='heading'>
								<h2>Thanks for trying</h2>&nbsp;&nbsp;<h2 className='highlight'>Selv!</h2>
							</span>
						</Space>
						<div className='thank-you-content-wrapper'>
							<div className='thank-you-content'>
								<div className='figure-wrapper'>
									<img className='figure' src={image1} alt='You signed in with DID' />
								</div>
								<div className='thank-you-text-wrapper'>
									<span>
										<img src={checkmark} alt='' />
										<h3>Improved experience</h3>
									</span>
									<p>
										Powered by IOTA, you managed to set up your Persistent Selv with very few clicks. Your data was reusable and this saved you time from filling forms online.
									</p>
								</div>
							</div>
							<div className='thank-you-content' id='middle-item'>
								<div className='thank-you-text-wrapper'>
									<span>
										<img src={checkmark} alt='' />
										<h3>Self Sovereignity</h3>
									</span>
									<p>
										You have taken full control of your data. You decided who you share your data with. Did you know that you can share them with others manually via QR code as well? Try it in the Selv app!
									</p>
								</div>
								<div className='figure-wrapper'>
									<img className='figure' src={image2} alt='Received new Credentials' />
								</div>
							</div>
							<div className='thank-you-content'>
								<div className='figure-wrapper'>
									<img className='figure' src={image3} alt='You signed in with DID' />
								</div>
								<div className='thank-you-text-wrapper'>
									<span>
										<img src={checkmark} alt='' />
										<h3>More Trust</h3>
									</span>
									<p>
										The data you shared with both the Far Future Foundation and The Act Now Foundation was verifiable. This allows you to verify your data instantly and freely using IOTA as the trust layer.
									</p>
								</div>
							</div>
						</div>
						<br />
						<div className='cta-wrapper'>
							<h5>Share the demo with your friends to improve the future</h5>
							<a 
								target='_blank'
                    			rel='noopener noreferrer'
								href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin)}`}
							>
								<Button className='cta'>Share on Twitter</Button>
							</a>
							<Link to={'/'}>
                                Return home
                            </Link>
						</div>
						<img src={dots} alt='' className='dots-bottom' />
					</div>
					<img src={dots} alt='' className='dots-top' />
					<Footer />
				</RandomGraphicElement>
				<Modal commentaryId={commentary} callback={() => setCommentary(null)} />
			</div>
		</div>
	);
};

export default ThankYou;
