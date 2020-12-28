import React from 'react';
import { Popover } from 'antd';
import { Popup } from '../components';

export default ({ commitment }) => (
	<Popover
		content={<Popup card={commitment} />}
		placement='bottom'
		trigger={['click', 'hover', 'focus']}>
		<div className='boundary'>
			<div className={`fill ${commitment?.status}`} />
			<div className='border' />
		</div>
	</Popover>
)