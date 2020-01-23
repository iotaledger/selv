import { useState, useEffect, useContext } from "react";
import Context from '../context/app-context';
import matchStep from "./matchSteps";

interface MatchResult {
    page: string | undefined;
    step: string | undefined;
    subStep: string | undefined;
}

const useStep = (match: any) => {
    const [step, setStep] = useState(0)
    const [subStep, setSubStep] = useState(0)
    const { subSteps, mainSteps, routes }: any = useContext(Context);
    const [nextStep, setNextStep] = useState('')
  
    useEffect(() => {
        async function setSteps() {
            const matchStepResult: MatchResult | null | undefined = matchStep(match.path)
            if (matchStepResult?.step) {
                setStep(Number(matchStepResult?.step))
            }
            if (matchStepResult?.subStep) {
                setSubStep(Number(matchStepResult?.subStep))
            }
    
            const idx = routes.findIndex(({ path }: { path: string; }) => path === match.path)
            if (idx && routes.length > idx + 1) {
              const next = routes[idx + 1].path
              setNextStep(next)
            }
        } 
        setSteps()
    }, [match, routes, step, subStep])

  return { step, subStep, nextStep, subSteps, mainSteps };
};

export default useStep;