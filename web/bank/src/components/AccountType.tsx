import React from 'react';
import { Form, Button, Checkbox, Radio } from 'antd';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';

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

    const { t } = useTranslation();

    return (
        <div className='empty-form'>
            <Form onSubmit={handleSubmit}>
                <Form.Item label={t(accountTypes.label)} colon={false}>
                    {getFieldDecorator('accountType', {
                        rules: [{
                            required: true,
                            message: t(accountTypes.error)
                        }]
                    })(
                        <Radio.Group>
                            {
                                accountTypes.accounts.map((account: string) =>
                                    <Radio key={account} style={{ display: 'block ' }} value={t(account)}>{t(account)}</Radio>
                                )
                            }
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label= {t("components.accountType.specialFeature")} colon={false}>
                    {getFieldDecorator(t(accountTypes.special), { //confused by this, shouldnt this rather be an id not the string?
                        valuePropName: 'checked'
                    })(
                        <Checkbox>
                            {t(accountTypes.special)}
                        </Checkbox>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' disabled={hasErrors(getFieldsError())}>
                        <Trans i18nKey="actions.continue">
                            Continue
                        </Trans>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const WrappedForm = Form.create({ name: 'radioGroup' })(RadioGroup);

export default WrappedForm;
