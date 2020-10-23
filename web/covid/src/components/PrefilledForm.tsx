import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import icon from '../assets/selv.svg';

const shortFields: string[] = ['Date', 'Nationality'];

const labels: { [ key: string ]: string; } = {
    FirstName: 'First Name',
    LastName: 'Last Name',
    Date: 'Date of birth',
    Nationality: 'Nationality',
    Country: 'Country of residence',
    Address: 'Address',
    PassportNumber: 'Passport Number',
    VisaApplicationNumber: 'Visa Application Number',
    VisaCountry: 'Country'
};

const Icon = () => <img src={icon} alt='' width={18} />;

const PrefilledForm = ({ form, dataFields }: {
    form: any;
    dataFields: any;
}) => {
    useEffect(() => {
        form.setFieldsValue(dataFields);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='prefilled-form'>
            <Form layout='vertical'>
                {
                    Object.keys(dataFields).map((field: string) => (
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
        </div>
    );
};

const WrappedPrefilledForm = Form.create()(PrefilledForm);

export default WrappedPrefilledForm;
