import { matchPath } from 'react-router';

interface MatchResult {
    page: string | undefined;
    companyId: string | undefined;
    theme: string | undefined;
}

interface Match {
    params: MatchResult | null | undefined;
}

export default (path: string): MatchResult | null | undefined => {
    const match: Match | null = matchPath({
        path: '/:lng?/:theme/:page/:companyId?',
        end: true
    }, path);
    return match?.params;
};
