import React from 'react';
import Impierce from './components/powerdBy/Impierce';
import UniMe from './components/apps/UniMe';
import UniMeImage from './assets/apps/unime-image.png';
import ViraImage from './assets/apps/vira-image.png';
import TangleLabs from './components/powerdBy/TangleLabs';
import Vira from './components/apps/Vira';


export interface WalletInfo {
    name: string,
    logo: React.ReactElement,
    by: React.ReactElement,
    image: string,
    description: string,
    link?: string,
    storeLinks?: {
        android: string,
        apple: string,
    }
}

export const wallets: WalletInfo[] = [
    {
        name: "UniMe",
        logo: <UniMe />,
        by: <Impierce />,
        image: UniMeImage,
        description: "An Identity Wallet to manage Decentralized Identities and Verifiable Credentials",
        storeLinks: {
            android: "https://play.google.com/store/apps/details?id=com.impierce.identity_wallet",
            apple: "https://testflight.apple.com/join/cNfBowKB"
        }
    },
    {
        name: "Vira",
        logo: <Vira />,
        by: <TangleLabs />,
        image: ViraImage,
        description: "Vira Identity Wallet is a digital identity wallet for the future. Giving you back control of your data and providing you with extended privacy throughout the web 3.0 space.",
        storeLinks: {
            android: "https://play.google.com/store/apps/details?id=io.tanglelabs.vira",
            apple: "https://apps.apple.com/de/app/vira-wallet/id6466040524"
        }
    }
]