import React from 'react';
import QRCode, { ImageSettings } from 'qrcode.react';
import logo from '../assets/iota.png'

export default ({ text }: { text: string }) => {
    const imageSettings: ImageSettings = {
      src: logo,
      height: 75,
      width: 75,
      excavate: true,
    }

    return (
      <div className="qr-code">
        { text && (
            <QRCode 
                value={text} 
                size={290}  
                level="H" 
                imageSettings={imageSettings}
            />
        )}
      </div>
    );
};
