import React from 'react';
import { Steps } from 'rsuite';

const styles = {
    width: '200px',
    display: 'inline-table',
    verticalAlign: 'top'
};

// https://rsuitejs.com/en/components/sidenav

const StepsInstance = ({ steps, stepId }) => {
    return (
        <div className='steps-wrapper'>
            <Steps current={Number(stepId)} vertical style={styles}>
                {
                    steps.map((step) =>
                        <Steps.Item
                            key={step.title}
                            title={step.title}
                        />
                    )
                }
            </Steps>
        </div>
    );
};

export default StepsInstance;
