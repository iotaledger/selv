import React from 'react';
import { Collapse } from 'antd';
import { RandomGraphicElement } from '../'
import ellipse from '../../assets/backgrounds/ellipse2.svg'
import circle from '../../assets/backgrounds/circleFrame3.svg'
import circleMobile from '../../assets/backgrounds/circleFrame4.svg'
import { Translation } from 'react-i18next';

const Icon = ({ params }: any) => {
    const fill = params?.isActive ? '#142037' : '#FFFFFF';
    return (
        <i aria-label="icon: right" className="anticon anticon-right ant-collapse-arrow">
            <svg width="24" height="24" focusable="false" data-icon="right" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0003 24C11.3403 24 10.8003 23.46 10.8003 22.8V1.2C10.8003 0.54 11.3403 0 12.0003 0C12.6603 0 13.2003 0.54 13.2003 1.2V22.8C13.2003 23.46 12.6603 24 12.0003 24Z" fill="white" />
                <path d="M22.8 13.2008H1.2C0.54 13.2008 0 12.6608 0 12.0008C0 11.3408 0.54 10.8008 1.2 10.8008H22.8C23.46 10.8008 24 11.3408 24 12.0008C24 12.6608 23.46 13.2008 22.8 13.2008Z" fill={fill} />
            </svg>
        </i>
    )
}


export default () => (
    <Translation>
        {
            (t) =>

                <RandomGraphicElement elements={10}>
                    <div className="faq-section" id="faq">
                        <img src={ellipse} alt="" className="ellipse" />
                        <img src={circle} alt="" className="circle" />
                        <img src={circleMobile} alt="" className="circle-mobile" />

                        <h2 data-aos="fade-up" data-aos-duration="1000">FAQs</h2>
                        <div className="faq-wrapper" data-aos="fade-up" data-aos-duration="1000">
                            <Collapse
                                bordered={false}
                                expandIconPosition="right"
                                expandIcon={params => <Icon params={params} />}
                                data-aos="fade-up" data-aos-duration="1000"
                            >
                                <Collapse.Panel
                                    header={(
                                        <div className="section-header">
                                            <h5>{t("landing.FAQ.question7")}</h5>
                                        </div>
                                    )}
                                    key={0}
                                >
                                    <div className="faq-content">
                                        <p>{t("landing.FAQ.answer7")}</p>
                                    </div>
                                </Collapse.Panel>
                                <Collapse.Panel
                                    header={(
                                        <div className="section-header">
                                            <h5>{t("landing.FAQ.question8")}</h5>
                                        </div>
                                    )}
                                    key={1}
                                >
                                    <div className="faq-content">
                                        <p>{t("landing.FAQ.answer8")}</p>
                                    </div>
                                </Collapse.Panel>
                                <Collapse.Panel
                                    header={(
                                        <div className="section-header">
                                            <h5>{t("landing.FAQ.question1")}</h5>
                                        </div>
                                    )}
                                    key={2}
                                >
                                    <div className="faq-content">
                                        <p>{t("landing.FAQ.answer1")}</p>
                                    </div>
                                </Collapse.Panel>
                                <Collapse.Panel
                                    header={(
                                        <div className="section-header">
                                            <h5>{t("landing.FAQ.question2")}</h5>
                                        </div>
                                    )}
                                    key={3}
                                >
                                    <div className="faq-content">
                                        <p>{t("landing.FAQ.answer2")}</p>
                                    </div>
                                </Collapse.Panel>
                                <Collapse.Panel
                                    header={(
                                        <div className="section-header">
                                            <h5>{t("landing.FAQ.question3")}</h5>
                                        </div>
                                    )}
                                    key={4}
                                >
                                    <div className="faq-content">
                                        <p>{t("landing.FAQ.answer3")}</p>
                                    </div>
                                </Collapse.Panel>
                                <Collapse.Panel
                                    header={(
                                        <div className="section-header">
                                            <h5>{t("landing.FAQ.question4")}</h5>
                                        </div>
                                    )}
                                    key={5}
                                >
                                    <div className="faq-content">
                                        <p>{t("landing.FAQ.answer4")}</p>
                                    </div>
                                </Collapse.Panel>
                                <Collapse.Panel
                                    header={(
                                        <div className="section-header">
                                            <h5>{t("landing.FAQ.question5")}</h5>
                                        </div>
                                    )}
                                    key={6}
                                >
                                    <div className="faq-content">
                                        <p>{t("landing.FAQ.answer5")}</p>
                                    </div>
                                </Collapse.Panel>
                                <Collapse.Panel
                                    header={(
                                        <div className="section-header">
                                            <h5>{t("landing.FAQ.question6")}</h5>
                                        </div>
                                    )}
                                    key={7}
                                >
                                    <div className="faq-content">
                                        <p>{t("landing.FAQ.answer6.part1")}<a target="_blank" rel="noopener noreferrer" href="https://files.iota.org/comms/IOTA_The_Case_for_a_Unified_Identity.pdf" >"{t("landing.FAQ.answer6.part2")}"</a>. {t("landing.FAQ.answer6.part3")} <a target="_blank" rel="noopener noreferrer" href="https://wiki.iota.org/">{t("landing.FAQ.answer6.part4")}</a> {t("landing.FAQ.answer6.part5")} <a target="_blank" rel="noopener noreferrer" href="https://github.com/iotaledger/identity.rs">{t("landing.FAQ.answer6.part6")}</a>{t("landing.FAQ.answer6.part7")}</p>
                                    </div>
                                </Collapse.Panel>
                            </Collapse>
                        </div>
                    </div>
                </RandomGraphicElement>
        }
    </Translation>
);