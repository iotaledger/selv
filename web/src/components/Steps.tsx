import React, { useState } from 'react';
import { Sidenav, Steps } from 'rsuite';
import i18n, { t } from 'i18next';
import classNames from 'classnames';

const styles = {
    width: '200px',
    display: 'inline-table',
    verticalAlign: 'top'
};

// https://rsuitejs.com/en/components/sidenav

const StepsInstance = ({ title, steps, stepId }: {
    title: string
    steps: any;
    stepId: any;
}) => {

    const [open, setOpen] = useState(true);
    return (

        <Sidenav activeKey='0'>
            <Sidenav.Body>
                <h2 className='todo-list'>
                    {t(title)} <button onClick={() => setOpen(!open)}></button>
                </h2>
                <div className={classNames('steps-wrapper', {'is-open': open})}>
                    <Steps current={Number(stepId)} currentStatus={"wait"} small vertical style={styles}>
                        {
                            steps.map((step: any) =>
                                <>
                                <Steps.Item                           
                                    key={step.title}
                                    title={i18n.t(step.title)}
                                />
                                <Steps current={Number(stepId)} currentStatus={"wait"} small vertical style={styles}>
                                    { step?.processes ? (
                                        <div className='substep-wrapper'>                                 
                                            {step?.processes.map((step: any) =>
                                                <Steps.Item                           
                                                    key={step.title}
                                                    title={i18n.t(step.title)}
                                                />
                                            )}
                                        </div>
                                    ) : <span></span>}
                                </Steps>
                                </>
                            )
                        }
                    </Steps>
                </div>
            </Sidenav.Body>
        </Sidenav>
        
    );
};

export default StepsInstance;
