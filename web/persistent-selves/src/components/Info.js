import React from 'react';
import { Popover } from 'antd';
import infoImg from '../assets/info.svg';

export default ({ info, title = null }) => (
	<Popover
		content={(
			<div className='popup-wrapper'>
				<div className='popup-content info'>
					{
						title ? (
							<React.Fragment>
								<p className='title bold'>{title}</p>
								<div className='placeholder' />
							</React.Fragment>
						) : null
					}
					<p className='value'>{info}</p>
				</div>
			</div>
		)}
		placement='bottom'
		trigger={['click', 'hover', 'focus']}>
		<img className='info' src={infoImg} alt='info' />
	</Popover>
);
