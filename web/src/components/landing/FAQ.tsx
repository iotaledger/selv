import React from 'react';
import { Collapse } from 'antd';
import { RandomGraphicElement } from '../'
import faq from '../../assets/landing/faq.svg' 
import ellipse from '../../assets/backgrounds/ellipse2.svg'
import circle from '../../assets/backgrounds/circleFrame3.svg'
import circleMobile from '../../assets/backgrounds/circleFrame4.svg'

const Icon = () => (
    <i aria-label="icon: right" className="anticon anticon-right ant-collapse-arrow">
        <img src={faq} alt="" />
    </i>
)

export default () => (
    <RandomGraphicElement elements={10}>
        <div className="faq-section" id="faq">
            <img src={ellipse} alt="" className="ellipse" />
            <img src={circle} alt="" className="circle" />
            <img src={circleMobile} alt="" className="circle-mobile" />

            <h2 data-aos="fade-up" data-aos-duration="2000">FAQs</h2>
            <div className="faq-wrapper" data-aos="fade-up" data-aos-duration="2000">
                <Collapse 
                    // defaultActiveKey={[1]} 
                    bordered={false} 
                    expandIconPosition="right"
                    expandIcon={() => <Icon />}
                    data-aos="fade-up" data-aos-duration="2000"
                >
                    <Collapse.Panel
                        header={(
                            <div className="section-header">
                                <h5>Does the IOTA Foundation track my data and usage?</h5>
                            </div>
                        )} 
                        key={1}
                    >
                        <div className="faq-content">
                            <p>We can’t! This solution puts data control in your hands. We have no way of accessing the data on your phone. Whenever you share data in the demo environment, you communicate this information to our servers, but it will be removed as soon as you complete the demo or close the connection. Once companies run demo’s or applications on their own servers, the IOTA Foundation, and other parties, will not be aware of the usage or data. For peer-to-peer sharing via QR codes, no information leaves the two communicating phones.</p>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className="section-header">
                                <h5>Can I restore my data if I lose my phone?</h5>
                            </div>
                        )} 
                        key={2}
                    >
                        <div className="faq-content">
                            <p>Not yet. This is currently a demonstration application, which means it doesn’t have all the features that a full release would have. The application is using (mostly) fake data, therefore recovery is not on top of mind. Backups will be available in a future update.</p>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className="section-header">
                                <h5>Does my personal data get uploaded to the Tangle?</h5>
                            </div>
                        )} 
                        key={3}
                    >
                        <div className="faq-content">
                            <p>No, absolutely no personal information is uploaded to the Tangle in accordance with GDPR regulations. Not even in a (pseudo)anonymized state. Any personal data uploaded to the Tangle would be in violation of "the right to be forgotten" as Tangle data is immutable.</p>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className="section-header">
                                <h5>How does this application benefit from IOTA and DLT in general?</h5>
                            </div>
                        )} 
                        key={4}
                    >
                        <div className="faq-content">
                            <p>Organisations sign credentials for the users, but how do we identify the organisations? Their digital identities are uploaded to the Tangle via 0-value transactions and are signed using asymmetric encryption methods. In addition, retraction of credentials are put on the Tangle as evidence that the credential can no longer be used.</p>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className="section-header">
                                <h5>On what IOTA network does this application run?</h5>
                            </div>
                        )} 
                        key={5}
                    >
                        <div className="faq-content">
                            <p>The mainnet! IOTA has zero fees, so it isn’t any more difficult to run this demo on the mainnet then on the devnet.</p>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className="section-header">
                                <h5>How can I learn more?</h5>
                            </div>
                        )} 
                        key={6}
                    >
                        <div className="faq-content">
                            <p>We released a whitepaper called: <a target="_blank" rel="noopener noreferrer" href="https://files.iota.org/comms/IOTA_The_Case_for_a_Unified_Identity.pdf" >"The Case for a Unified Identity"</a>. It is a relatively easy introduction to the subject and explains what the benefits are of a Unified Identity Protocol.</p>
                        </div>
                    </Collapse.Panel>
                </Collapse>
            </div>
        </div>
    </RandomGraphicElement>
);