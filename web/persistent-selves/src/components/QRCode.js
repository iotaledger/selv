import React from 'react';
import QRCode from 'qrcode.react';

export default ({ text, size }) => (
    <div className='qr-code'>
        { text && (
            <QRCode
                value={text}
                size={size || 290}
                level='H'
            />
        )}
    </div>
);
