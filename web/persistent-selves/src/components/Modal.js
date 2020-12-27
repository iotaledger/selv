import React, { useState } from 'react';
import { Modal } from 'rsuite';
import commentary from '../assets/commentary';

export default ({ commentaryId, callback }) => {
	const [open, setOpen] = useState(!!commentaryId);
	const content = commentary[commentaryId];

	const close = () => {
		setOpen(false);
		console.log('Modal close')
		callback();
	}

	console.log('Modal', commentaryId, content)
	return (
		<Modal overflow={true} show={open} onHide={close}>
			{ content }
			<Modal.Footer>
				<button onClick={close} className='modal-close'>
					Close
				</button>
			</Modal.Footer>
        </Modal>
	)
}