import React from 'react';
import 'rsuite/dist/styles/rsuite-default.css'
import { Steps } from 'rsuite';

const styles = {
    width: '200px',
    display: 'inline-table',
    verticalAlign: 'top'
};

  
// https://rsuitejs.com/en/components/sidenav

const StepsInstance = ({ steps, subSteps, stepId }: {
    steps: any;
    subSteps?: JSX.Element | null | undefined;
    stepId: any;
}) => {
    return (
        <div className="steps-wrapper">
            <Steps current={stepId} vertical style={styles}>
                {
                    steps.map((step: any, index: number) => 
                        <Steps.Item 
                            key={step.title} 
                            title={step.title} 
                            description={step.subSteps && stepId === index ? subSteps : null}
                        />
                    )
                }
            </Steps>
      </div>
    );
};

export default StepsInstance