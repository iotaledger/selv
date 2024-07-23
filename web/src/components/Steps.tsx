import React from 'react';

import i18n, { t } from 'i18next';
import classNames from 'classnames';
import { Steps } from 'antd';
import { MainStep, Route } from 'src/steps';


const processStyles = {
    marginTop: '20px',
};

const StepsInstance = ({ title, steps, currentRoute }: {
    title: string
    steps: MainStep[];
    currentRoute: Route;
}) => {

    return (

        <section>
            <h2 className='todo-list'>
                {t(title)}
            </h2>
            <div className={classNames('steps-wrapper')}>
                <Steps
                    current={steps.findIndex(elem => elem.id === currentRoute.step)}
                    size={"small"}
                    direction={"vertical"}
                    items={steps.map((step) => ({
                        title: i18n.t(step.title),
                        description: currentRoute.step === step.id && <Steps
                            current={step.processes?.findIndex(elem => elem.id === currentRoute.step)}
                            progressDot
                            direction={"vertical"}
                            style={processStyles}
                            items={step.processes?.map((process) => ({
                                title: i18n.t(process.title),
                            })
                            )}
                        />
                    }))}
                />

            </div>

        </section>
    );
};

export default StepsInstance;
