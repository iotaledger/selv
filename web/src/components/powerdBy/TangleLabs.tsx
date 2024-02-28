import React from 'react';
import poweredByIota from '../../assets/poweredBy/Tangle_Labs_Horizontal_Logo_Black_Text_Coloured_Icon_with_Black_Background.svg';

export default () => (
    <a
        href='https://www.tanglelabs.io/'
        target='_blank'
        rel='noopener noreferrer'
    >
        <img src={poweredByIota} width={125} alt='powered by TangleLabs' />
    </a>
);
