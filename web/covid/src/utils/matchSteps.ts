import { matchPath } from 'react-router';

interface MatchResult {
    page: string | undefined;
    step: string | undefined;
    testId: string | undefined;
    theme: string | undefined;
}

interface Match {
    params: MatchResult | null | undefined;
}

export default (path: string): MatchResult | null | undefined => {
    const match: Match | null = matchPath(path, {
        path: '/:theme/:page/:step?/:testId?',
        exact: true,
        strict: false
    });
    return match?.params;
};
