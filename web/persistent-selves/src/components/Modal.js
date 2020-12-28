import React, { useState, useEffect } from 'react';
import { Modal } from 'rsuite';
import commentary from '../assets/commentary';

export default ({ commentaryId, callback }) => {
	const [isOpen, setOpen] = useState(!!commentaryId);
	const content = commentary[commentaryId];

    useEffect(() => {
		setOpen(!!commentaryId);
    }, [commentaryId]); // eslint-disable-line react-hooks/exhaustive-deps

	const close = () => {
		setOpen(false);
		callback();
	}

	return (
		<Modal overflow={true} show={isOpen} onHide={close}>
			{ content }
			<Modal.Footer>
				<button onClick={close} className='modal-close'>
					Close
				</button>
			</Modal.Footer>
        </Modal>
	)
}