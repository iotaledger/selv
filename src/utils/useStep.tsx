import { useState, useEffect, useContext } from 'react';
import Context from '../context/app-context';
import matchStep from './matchSteps';

interface MatchResult {
    page: string | undefined;
    step: string | undefined;
    testId: string | undefined;
    theme: string | undefined;
}

const useStep = (match: any) => {
    const [step, setStep] = useState(0);
    const { mainSteps, routes }: any = useContext(Context);
    const [nextStep, setNextStep] = useState('');
    const [theme, setTheme] = useState('');

    useEffect(() => {
        async function setSteps () {
            const matchStepResult: MatchResult | null | undefined = matchStep(match.path);
            if (matchStepResult?.step) {
                if (match?.params?.step) {
                    setStep(Number(match?.params?.step));
                } else {
                    setStep(Number(matchStepResult?.step));
                }
            }

            if (matchStepResult?.theme) {
                setTheme(matchStepResult?.theme);
            }

            const idx = routes.findIndex(({ path }: { path: string; }) => path === match.path);
            if (idx !== -1 && routes.length > idx + 1) {
                const next = routes[idx + 1].path;
                setNextStep(next);
            }
        }
        setSteps();
    }, [match, routes, step]);

    return { step, nextStep, mainSteps, theme };
};

export default useStep;
