import React from 'react';
import { RandomGraphicElement } from '..';
import connected from '../../assets/landing/connected.svg';
import { Translation } from 'react-i18next';
import { Flex } from 'antd';

const ControlIdentity = () => (
    <Translation>
        {
            (t) =>

                <RandomGraphicElement elements={5}>
                    <div className='control-identity-section'>
                        <div className='content-wrapper'>
                            <div className='text-content-wrapper' data-aos='fade-up' data-aos-duration='1000'>
                                <Flex style={{alignSelf:"center"}} justify='center'>
                                    <h2>{t("landing.controlIdentity.theProblem")}</h2>
                                </Flex>
                                <p>{t("landing.controlIdentity.theProblemText")}</p>
                            </div>
                            <div className='text-content-wrapper' data-aos='fade-up' data-aos-duration='1000'>
                                <Flex style={{alignSelf:"center"}} justify='center'>
                                    <h2>{t("landing.controlIdentity.theSolution")}</h2>
                                </Flex>
                                <p>{t("landing.controlIdentity.theSolutionText")}</p>
                            </div>
                            <img data-aos='fade-up' data-aos-duration='1000' src={connected} alt='Connected' className='illustration' />
                        </div>
                    </div>
                </RandomGraphicElement>
        }
    </Translation>
);

export default ControlIdentity;
