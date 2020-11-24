import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import icon from '../assets/selv.svg';

const shortFields = ['Date', 'Nationality'];

const labels = {
    FirstName: 'First Name',
    LastName: 'Last Name',
    Date: 'Date of birth',
    Nationality: 'Nationality',
    Gender: 'Gender',
    Country: 'Country of residence',
    Phone: 'Phone number',
    Address: 'Address',
    CompanyName: 'Company name',
    CompanyAddress: 'Company address',
    CompanyType: 'Company type',
    CompanyBusiness: 'Nature of business',
    CompanyCreationDate: 'Company creation date',
    CompanyNumber: 'Company number',
    CompanyOwner: 'Managing director',
    BankName: 'Name of the bank',
    AccountType: 'Bank account type'
};

const Icon = () => <img src={icon} alt='' width={18} />;

const PrefilledForm = ({ form, dataFields }) => {
    useEffect(() => {
        form.setFieldsValue(dataFields);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='prefilled-form'>
            <Form layout='vertical'>
                {
                    Object.keys(dataFields).map((field) => (
                        <Form.Item
                            label={labels[field]}
                            key={field}
                            className={shortFields.includes(field) ? 'short-field' : ''}
                        >
                            { form.getFieldDecorator(field, {})(
                                <Input disabled suffix={<Icon />} />
                            ) }
                        </Form.Item>
                    ))
                }
            </Form>
            <p className='notice bold small'>Credentials provided by Selv ID</p>
        </div>
    );
};

const WrappedPrefilledForm = Form.create()(PrefilledForm);

export default WrappedPrefilledForm;
