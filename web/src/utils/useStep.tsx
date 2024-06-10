import { useState, useEffect } from 'react';
import { useGlobalState } from '../context/globalState';
import matchStep from './matchSteps';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router-dom';

interface MatchResult {
    page: string | undefined;
    step: string | undefined;
    companyId: string | undefined;
    theme: string | undefined;
}

const useStep = () => {
    const [step, setStep] = useState(0);
    const { mainSteps, routes }: any = useGlobalState();
    const [nextStep, setNextStep] = useState('');
    const [currentRoute, setCurrentRoute] = useState<any>(null);
    const [theme, setTheme] = useState('');
    const location = useLocation();

    const { i18n } = useTranslation();

    useEffect(() => {
        async function setSteps () {
            const matchStepResult: MatchResult | null | undefined = matchStep(location.pathname);
            if (matchStepResult?.step) {
                console.log(matchStepResult, location)
                // TODO: figure out was is going on here
                if(false) {  // if (location?.search?.step) {
                    //setStep(Number(match?.params?.step));
                } else {
                    setStep(Number(matchStepResult?.step));
                }
            }
            
            if (matchStepResult?.theme) {
                setTheme(matchStepResult?.theme);
            }
            
            const idx = routes.findIndex(({ path }: { path: string; }) => matchPath(path, location.pathname));
            setCurrentRoute(routes[idx]);
            if (idx !== -1 && routes.length > idx + 1) {
                var next = routes[idx + 1].path;
                next = next.replace(":lng?", i18n.language.toString()); //replace route-param
                setNextStep(next);
            }
        }
        setSteps();
    }, [location, routes, step]);

    return { step, currentRoute, nextStep, mainSteps, theme };
};

export default useStep;
