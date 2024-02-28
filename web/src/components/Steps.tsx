import React from 'react';
import { Steps } from 'rsuite';
import i18n from 'i18next';

const styles = {
    width: '200px',
    display: 'inline-table',
    verticalAlign: 'top'
};

// https://rsuitejs.com/en/components/sidenav

const StepsInstance = ({ steps, stepId }: {
    steps: any;
    stepId: any;
}) => {
    return (
        <div className='steps-wrapper'>
            <Steps current={Number(stepId)} vertical style={styles}>
                {
                    steps.map((step: any) =>
                        <Steps.Item
                            key={step.title}
                            title={i18n.t(step.title)}
                        />
                    )
                }
            </Steps>
        </div>
    );
};

export default StepsInstance;
