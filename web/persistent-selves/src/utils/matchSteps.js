import { matchPath } from 'react-router';

export default (path) => {
    const match = matchPath(path, {
        path: '/:theme/:page/:step?',
        exact: true,
        strict: false
    });
    return match?.params;
};
