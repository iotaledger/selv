import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import icon from '../assets/selv.svg';
import { useTranslation } from 'react-i18next';

const shortFields: string[] = ['Date', 'Nationality'];

// const labels: { [key: string]: string; } = {
//     FirstName: 'First Name',
//     LastName: 'Last Name',
//     Date: 'Date of birth',
//     Nationality: 'Nationality',
//     Gender: 'Gender',
//     Birthplace: 'Birthplace',
//     Country: 'Country of residence',
//     Phone: 'Phone number',
//     Address: 'Address',
//     CompanyName: 'Company name',
//     CompanyAddress: 'Company address',
//     CompanyType: 'Company type',
//     CompanyBusiness: 'Nature of business',
//     CompanyCreationDate: 'Company creation date',
//     CompanyNumber: 'Company number',
//     CompanyOwner: 'Managing director',
//     BankName: 'Name of the bank',
//     AccountType: 'Bank account type'
// };

const Icon = () => <img src={icon} alt='' width={18} />;

const PrefilledForm = ({ form, dataFields }: {
    form: any;
    dataFields: any;
}) => {
    useEffect(() => {
        form.setFieldsValue(dataFields);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const { t } = useTranslation();
    
    return (
        <div className='prefilled-form'>
            <Form layout='vertical'>
                {
                    Object.keys(dataFields).map((field: string) => (
                        <Form.Item
                            label={t("components.prefilledForm."+field)}
                            key={field}
                            className={shortFields.includes(field) ? 'short-field' : ''}
                        >
                            { form.getFieldDecorator(field, {})(
                                <Input disabled suffix={<Icon />} />
                            )}
                        </Form.Item>
                    ))
                }
            </Form>
            <p className='notice bold small'>{t("components.prefilledForm.credentialsBySelv")}</p>
        </div>
    );
};

const WrappedPrefilledForm = Form.create()(PrefilledForm);

export default WrappedPrefilledForm;
