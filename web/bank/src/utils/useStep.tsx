import { useState, useEffect, useContext } from 'react';
import Context from '../context/app-context';
import matchStep from './matchSteps';
import { useTranslation } from 'react-i18next';

interface MatchResult {
    page: string | undefined;
    step: string | undefined;
    companyId: string | undefined;
    theme: string | undefined;
}

const useStep = (match: any) => {
    const [step, setStep] = useState(0);
    const { mainSteps, routes }: any = useContext(Context);
    const [nextStep, setNextStep] = useState('');
    const [theme, setTheme] = useState('');

    const { i18n } = useTranslation();

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
                var next = routes[idx + 1].path;
                next = next.replace(":lng?", i18n.language.toString()); //replace route-param
                setNextStep(next);
            }
        }
        setSteps();
    }, [match, routes, step]);

    return { step, nextStep, mainSteps, theme };
};

export default useStep;
