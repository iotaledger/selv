import React from 'react';

export default ({ card }) => (
	<div className='popup-wrapper'>
		<div className='popup-content'>
			<p className='title bold'>Boundary {card?.status}</p>
			<div className='placeholder' />
		</div>
		<div className='popup-content'>
			<p className='title'>Planetary boundary:</p>
			<div className='placeholder' />
			<p className='value bold'>{card?.boundary}</p>
		</div>
		<div className='popup-content'>
			<p className='title'>Current value:</p>
			<div className='placeholder' />
			<p className='value bold'>{card?.value}</p>
		</div>
	</div>
)