import React from 'react';
import { App, Input, QRCode } from 'antd';
import { CopyOutlined, SendOutlined } from '@ant-design/icons';

const QRCodeComponent = ({ text, size }: { text: string; size?: number; }) => {

    const { message } = App.useApp();

    const copyToClipbloard = (text: string) => {

        //@ts-ignore
        navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
            console.log(result)
            message.open({
                type: 'error',
                content: 'Could not get permission to copy text to clipboard',
              });
            if (result.state === "granted" || result.state === "prompt") {
                /* write to the clipboard now */
                navigator.clipboard.writeText(text).then(function () {
                    message.open({
                        type: 'success',
                    content: 'Link copied to clipboard',
                    });
                    console.log('Async: Copying to clipboard was successful!');
                }, function (err) {
                    message.open({
                        type: 'error',
                        content: 'Could not copy text to clipboard',
                      });
                });
            }
        });


    }

    const gotoLink = (text: string) => {
        window.location.href = text;
    }

    return (
        <>
            <div className='qr-code'>
                {text && (
                    <QRCode type="svg" status={text ? 'active' : 'loading'} bordered={false} value={text} errorLevel='H' size={size || 290}/>
                )}
            </div>
            <div className='qr-code__link'>
                <Input addonBefore={<CopyOutlined onClick={() => copyToClipbloard(text)} />} value={text} onChange={() => undefined} addonAfter={<SendOutlined onClick={() => gotoLink(text)} />} />
            </div>
        </>
    )
};

export default QRCodeComponent;
