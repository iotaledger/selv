import React from 'react';
import { Steps } from 'antd';
import i18n from 'i18next';

const styles = {
    width: '200px',
    display: 'inline-table',
    verticalAlign: 'top'
};

const StepsInstance = ({ steps, stepId }: {
    steps: any;
    stepId: number;
}) => {
    return (
        <div className='steps-wrapper'>
            <Steps current={stepId} size={'small'} direction="vertical" style={styles} items={steps.map((step: { title: string }) => ({ ...step, title: i18n.t(step.title) }))} />
        </div>
    );
};

export default StepsInstance;
