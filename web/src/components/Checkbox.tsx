import React from 'react';
import { Form, Button, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';

const CheckboxInstance = ({ form, onSubmit, status, messages, buttonText }: {
    form: any;
    onSubmit: (values: object) => void;
    status: string;
    messages: { [key: string]: string; };
    buttonText: string;
}) => {
    const { getFieldDecorator, getFieldsError, validateFields } = form;

    const { t } = useTranslation();

    function handleSubmit(e: any) {
        e.preventDefault();
        validateFields((err: any, values: string[]) => {
            if (!err) {
                onSubmit(values);
            }
        });
    }

    function hasErrors(fieldsError: any) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    return (
        <div className='empty-form'>
            <Form layout='vertical' onFinish={handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                        initialValue: false,
                        rules: [{
                            required: true,
                            transform: (value: boolean) => (value || undefined),
                            type: 'boolean',
                            message: t("components.checkBox.errorMessage")
                        }]
                    })(
                        <Checkbox>
                            {t("components.checkBox.confirm")}
                        </Checkbox>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        htmlType='submit'
                        disabled={hasErrors(getFieldsError()) || status === messages.waiting}
                    >
                        {buttonText}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CheckboxInstance;
