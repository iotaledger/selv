import { matchPath } from 'react-router';

interface MatchResult {
    page: string | undefined;
    step: string | undefined;
    companyId: string | undefined;
    theme: string | undefined;
}

interface Match {
    params: MatchResult | null | undefined;
}

export default (path: string): MatchResult | null | undefined => {
    const match: Match | null = matchPath(path, {
        path: '/:lng?/:theme/:page/:step?/:companyId?',
        exact: true,
        strict: false
    });
    return match?.params;
};
