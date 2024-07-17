import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { RandomGraphicElement } from '..';
import { Translation } from 'react-i18next';


const AppSection =  () => (
    <Translation>
        {
            (t) =>

                <RandomGraphicElement elements={5}>
                    <div className='app-section' id='the-app'>
                        <Link to='/demo/todos'>
                            <Button className='cta' data-aos='fade-up' data-aos-duration='1000'>
                                {t("landing.app.tryTheDemo")}
                            </Button>
                        </Link>
                    </div>
                </RandomGraphicElement>
        }
    </Translation>
);

export default AppSection;