import React from 'react';
import { Form, Button, Checkbox, Radio } from 'antd';

interface IAccountType {
    label: string;
    error: string;
    accounts: string[];
    special: string;
}
const RadioGroup = ({ form, onSubmit, accountTypes }: {
    form: any;
    onSubmit: (values: object) => void;
    accountTypes: IAccountType;
}) => {
    const { getFieldDecorator, getFieldsError, validateFields } = form;

    function handleSubmit (e: any) {
        e.preventDefault();
        validateFields((err: any, values: string[]) => {
            if (!err) {
                onSubmit(values);
            }
        });
    }

    function hasErrors (fieldsError: any) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    return (
        <div className='empty-form'>
            <Form onSubmit={handleSubmit}>
                <Form.Item label={accountTypes.label} colon={false}>
                    {getFieldDecorator('accountType', {
                        rules: [{
                            required: true,
                            message: accountTypes.error
                        }] })(
                            <Radio.Group>
                                    {
                                        accountTypes.accounts.map((account: string) =>
                                            <Radio key={account} style={{ display: 'block ' }} value={account}>{account}</Radio>
                                        )
                                    }
                            </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label='Special feature' colon={false}>
                    {getFieldDecorator(accountTypes.special, {
                        valuePropName: 'checked'
                    })(
                        <Checkbox>
                            {accountTypes.special}
                        </Checkbox>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' disabled={hasErrors(getFieldsError())}>
                        Continue
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const WrappedForm = Form.create({ name: 'radioGroup' })(RadioGroup);

export default WrappedForm;
