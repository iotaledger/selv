import React from 'react';
import poweredByIota from '../../assets/poweredBy/impierce-logo-blue.png';

export default () => (
    <a
        href='https://impierce.com/'
        target='_blank'
        rel='noopener noreferrer'
    >
        <img src={poweredByIota} width={125} alt='powered by Impierce' />
    </a>
);
