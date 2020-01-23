import { matchPath } from "react-router";

interface MatchResult {
    page: string | undefined;
    step: string | undefined;
    subStep: string | undefined;
}

interface Match {
    params: MatchResult | null | undefined;
}

export default (path: string): MatchResult | null | undefined => {
    const match: Match | null = matchPath(path, {
        path: "/progress/:page/:step?/:subStep?",
        exact: true,
        strict: false
    });
    return match?.params
}