import React from 'react';
import { App, Input, QRCode } from 'antd';
import { CopyOutlined, SendOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const QRCodeComponent = ({ text, size }: { text?: string; size?: number; }) => {

    const { message } = App.useApp();

    const { t } = useTranslation();

    const copyToClipbloard = (text: string) => {

        //@ts-ignore
        navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
            if (result.state === "granted" || result.state === "prompt") {
                /* write to the clipboard now */
                navigator.clipboard.writeText(text).then(function () {
                    message.open({
                        type: 'success',
                        content: t("components.QR.copySuccess"),
                    });
                }, function (err) {
                    message.open({
                        type: 'error',
                        content: t("components.QR.copyError"),
                    });
                });
            } else {
                message.open({
                    type: 'error',
                    content: t("components.QR.copyErrorPermission"),
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
                <QRCode type="svg" status={text ? 'active' : 'loading'} bordered={false} value={text ?? "loading"} errorLevel='H' size={size || 290} />
            </div>
            <div className='qr-code__link'>
                <Input addonBefore={<CopyOutlined onClick={() => copyToClipbloard(text ?? "")} />} value={text} onChange={() => undefined} addonAfter={<SendOutlined onClick={() => gotoLink(text ?? "")} />} />
            </div>
        </>
    )
};

export default QRCodeComponent;
