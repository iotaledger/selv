import { useState, useEffect } from 'react';
import { useGlobalState } from '../context/globalState';
import matchStep from './matchSteps';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router-dom';

interface MatchResult {
    page: string | undefined;
    companyId: string | undefined;
    theme: string | undefined;
}

const useStep = (): { currentRoute: any | null, nextStep: any | null, mainSteps: {id: string, title: string}[], theme: any | null } => {
    const { mainSteps, routes } = useGlobalState();
    const [nextStep, setNextStep] = useState(null);
    const [currentRoute, setCurrentRoute] = useState(null);
    const [theme, setTheme] = useState<string | null>(null);
    const location = useLocation();

    const { i18n } = useTranslation();

    useEffect(() => {
        async function setSteps() {
            const matchStepResult: MatchResult | null | undefined = matchStep(location.pathname);

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
    }, [location, routes, i18n]);

    return { currentRoute, nextStep, mainSteps, theme };
};

export default useStep;
