import React, { useState } from 'react';
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Select,
    Checkbox,
    Button,
    AutoComplete,
} from 'antd';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const policyUrl = 'https://www.iota.org/research/privacy-policy'

const FormInstance = ({ form }: { form: any }) => {
    const [confirmDirty, setConfirmDirty] = useState(false);
    const [autoCompleteResult, setAutoCompleteResult] = useState([]);
    const [user, setUser] = useState(null);
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    function handleSubmit(e: any) {
        e.preventDefault();
        form.validateFieldsAndScroll((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);
                signUp(values);
            }
        });
    };

    function handleConfirmBlur(e: any) {
        const { value } = e.target;
        setConfirmDirty(confirmDirty || !!value);
    };

    async function signUp({ name, password, email, prefix, phone }: {
        name: string;
        password: string;
        email: string; 
        prefix: string;
        phone: string;
    }) {
        try {
            console.log(JSON.stringify({ name, password, email, prefix, phone }));
        } catch (e) {
            console.log(e)
        }
    }

    function compareToFirstPassword(rule: string, value: string, callback: (text?: string) => void) {
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    function validateToNextPassword(rule: string, value: string, callback: () => void) {
        if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    const { getFieldDecorator } = form;

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };
    const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '49',
    })(
        <Select style={{ width: 70 }}>
            <Option value="44">+44</Option>
            <Option value="49">+49</Option>
        </Select>,
    );

    const websiteOptions = autoCompleteResult.map(website => (
        <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
        <React.Fragment>
            {
                signUpSuccess ? (
                    <div>Hello</div>
                ) : (
                    <Form {...formItemLayout} onSubmit={handleSubmit}>
                        <Form.Item
                            label="Name">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please enter your real name!', whitespace: true }],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="E-mail">
                            {getFieldDecorator('email', {
                                rules: [
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Password" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    validator: validateToNextPassword,
                                },
                                ],
                            })(<Input.Password />)}
                        </Form.Item>
                        <Form.Item label="Confirm Password" hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                {
                                    validator: compareToFirstPassword,
                                },
                                ],
                            })(<Input.Password onBlur={handleConfirmBlur} />)}
                        </Form.Item>
                        <Form.Item label="Phone Number">
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                        </Form.Item>
                        <Form.Item
                            label={
                                <span>
                                Website&nbsp;
                                <Tooltip title="What is your company website?">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                                </span>
                            }
                            >
                            {getFieldDecorator('website', {})(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            {getFieldDecorator('agreement', {
                                valuePropName: 'checked',
                                rules: [{ required: true, message: 'Please agree to the terms!' }],
                            })(
                                <Checkbox>
                                    I have read the <a 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        href={policyUrl}
                                    >agreement</a>
                                </Checkbox>,
                            )}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                )
            }
        </React.Fragment>
    );
}

const WrappedForm = Form.create({ name: 'register' })(FormInstance);

export default WrappedForm;

