import React from 'react';
import QRCode, { ImageSettings } from 'qrcode.react';

export default ({ text, size }: { text: string; size?: number; }) => {

    return (
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
};
