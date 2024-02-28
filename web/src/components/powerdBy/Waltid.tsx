import React from 'react';
import poweredByIota from '../../assets/poweredBy/Walt.id_Logo_transparent.png';

export default () => (
    <a
        href='https://walt.id/'
        target='_blank'
        rel='noopener noreferrer'
    >
        <img src={poweredByIota} width={75} alt='powered by walt.id' />
    </a>
);
