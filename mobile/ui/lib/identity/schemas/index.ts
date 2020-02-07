export enum SchemaNames {
    BANK_ACCOUNT = 'BankAccount',
    PERSONAL_DATA = 'PersonalData'
};

export const BankAccountSchema = {
    type: 'object',
    required: [
        'did'
    ],
    properties: {
        did: {
            type: 'string'
        },
        language: {
            type: 'string'
        },
        locale: {
            type: 'string'
        },
        bank: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
                accountType: {
                    type: 'string'
                },
                accountNumber: {
                    type: 'string'
                },
            }
        }
    }
}

export const PersonalDataSchema = {
    type: 'object',
    required: [
        'did'
    ],
    properties: {
        did: {
            type: 'string'
        },
        language: {
            type: 'string'
        },
        locale: {
            type: 'string'
        },
        timezoneOffset: {
            type: 'string'
        },
        personalInfo: {
            type: 'object',
            properties: {
                username: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string'
                        },
                        firstName: {
                            type: 'string'
                        },
                        lastName: {
                            type: 'string'
                        }
                    }
                },
                dob: {
                    type: 'object',
                    properties: {
                        date: {
                            type: 'string'
                        },
                        age: {
                            type: 'number'
                        }
                    }
                },
                nationality: {
                    type: 'string'
                },
                gender: {
                    type: 'string'
                }
            }
        }
    }
}

export const Schemas = {
    [SchemaNames.BANK_ACCOUNT]: BankAccountSchema,
    [SchemaNames.PERSONAL_DATA]: PersonalDataSchema
};
