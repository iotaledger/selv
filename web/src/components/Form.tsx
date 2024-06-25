import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

const shortFields: string[] = ['Date', 'Nationality'];

const ManualForm = ({ dataFields, onSubmit, submitLabel }: {
    dataFields: {
        label: string,
        field: string,
    }[];
    onSubmit: (fields: {[field: string]: string}) => void
    submitLabel: string
}) => {

    const [form] = Form.useForm()

    const [submittable, setSubmittable] = React.useState<boolean>(false);

    // Watch all values
    const values = Form.useWatch([], form);
  
    React.useEffect(() => {
      form
        .validateFields({ validateOnly: true })
        .then(() => setSubmittable(true))
        .catch(() => setSubmittable(false));
    }, [form, values]);

    const { t } = useTranslation();

    const onFinish = (values: any) => {
        onSubmit(values)
    };

    return (
        <div className='prefilled-form'>
            <Form layout='vertical' form={form} onFinish={onFinish}>
                {
                    dataFields.map((item, index) => (
                        <Form.Item
                            label={t(item.label)}
                            key={item.field}
                            name={item.field}
                            rules={[{ required: true }]}
                            className={shortFields.includes(item.field) ? 'short-field' : ''}
                        >
                            <Input />
                        </Form.Item>
                    ))
                }
                    <Form.Item label=" " colon={false}>
                    <Button type="primary" htmlType="submit" disabled={!submittable}>
                        {submitLabel}
                    </Button>
                    </Form.Item>
            </Form>
        </div>
    );
};

export default ManualForm;
