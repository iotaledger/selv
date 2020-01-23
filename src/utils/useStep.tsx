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
    const { nextStep, subSteps, mainSteps }: any = useContext(Context);
  
    useEffect(() => {
        const matchStepResult: MatchResult | null | undefined = matchStep(match.path)
        if (matchStepResult?.step) {
            setStep(Number(step))
        }
        if (matchStepResult?.subStep) {
            setSubStep(Number(subStep))
        }
    }, [])

  return { step, subStep, nextStep, subSteps, mainSteps };
};

export default useStep;