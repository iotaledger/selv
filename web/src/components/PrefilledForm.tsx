import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import icon from '../assets/selv.svg';
import { useTranslation } from 'react-i18next';

const shortFields: string[] = ['Date', 'Nationality'];

const Icon = () => <img src={icon} alt='' width={18} />;

const PrefilledForm = ({ dataFields }: {
    dataFields: any;
}) => {

    const [form] = Form.useForm()

    useEffect(() => {
        form.setFieldsValue(dataFields);
    }, [dataFields, form]);


    const { t } = useTranslation();

    return (
        <div className='prefilled-form'>
            <Form layout='vertical' form={form}>
                {
                    Object.keys(dataFields).map((field: string, index) => (
                        <Form.Item
                            label={t("components.prefilledForm." + field)}
                            key={field}
                            name={field}
                            className={shortFields.includes(field) ? 'short-field' : ''}
                        >
                            {/* { form.getFieldDecorator(field, {})( */}
                            <Input disabled suffix={<Icon />} />
                            {/* )} */}
                        </Form.Item>
                    ))
                }
            </Form>
            <p className='notice bold small'>{t("components.prefilledForm.credentialsBySelv")}</p>
        </div>
    );
};

export default PrefilledForm;
