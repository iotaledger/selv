export const flattenObject = (obj: {[key: string]: any;}, prefix = '') =>
    Object.keys(obj).reduce((acc: any, k: any) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (obj[k] && typeof obj[k] === 'object') {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[k] = obj[k]; // acc[pre + k] to keep the nested structure
        }
        return acc;
    }, {});

export const getCompanyId = async () => {
    const companyDetailsString: string | null = await localStorage.getItem('companyDetails');
    const companyDetails = companyDetailsString && await JSON.parse(companyDetailsString);
    return companyDetails?.data?.CompanyNumber;
};

export const getRandomInt = (max: number) =>
    Math.abs(Math.floor(Math.random() * Math.floor(max)));
