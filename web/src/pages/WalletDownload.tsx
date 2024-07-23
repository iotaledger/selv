import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { wallets } from '../wallets';

const WalletDownload: React.FC = () => {
    const { wallet } = useParams();

    const selectedWallet = wallets.find(elem => elem.name === wallet);

    useEffect(() => {

        if (!selectedWallet) {
            return; //TODO handle error
        }

        var isMobile = {
            Android: function () {
                return /Android/i.test(navigator.userAgent);
            },

            iOS: function () {
                return /iPhone|iPad|iPod/i.test(navigator.userAgent);
            }
        };

        let storeLink;

        if (isMobile.Android()) {
            storeLink = selectedWallet.storeLinks?.android;
        } else if (isMobile.iOS()) {
            storeLink = selectedWallet.storeLinks?.apple;
        }

        if (!storeLink) {
            return; //TODO handle error
        }

        window.location.replace(storeLink);
        
        }, [selectedWallet]);

    return (<></>);
};

export default WalletDownload;
