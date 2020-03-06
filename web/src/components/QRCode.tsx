import React from 'react';
import QRCode, { ImageSettings } from 'qrcode.react';
import logo from '../assets/iota.png';

export default ({ text, size }: { text: string; size?: number; }) => {
    const imageSettings: ImageSettings = {
        src: logo,
        height: 55,
        width: 55,
        excavate: true
    };

    return (
        <div className='qr-code'>
            { text && (
                <QRCode
                    value={text}
                    size={size || 290}
                    level='H'
                    imageSettings={imageSettings}
                />
            )}
        </div>
    );
};
