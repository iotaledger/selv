export enum SchemaNames {
    ADDRESS = 'Address',
    BANK_ACCOUNT = 'BankAccount',
    COMPANY = 'Company',
    CONTACT_DETAILS = 'ContactDetails',
    INSURANCE = 'Insurance',
    PERSONAL_DATA = 'PersonalData',
    USER_DATA_CREDENTIALS = 'UserDataCredentials'
};

export const AddressSchema = {
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
        address: {
            type: 'object',
            properties: {
                city: {
                    type: 'string'
                },
                state: {
                    type: 'string'
                },
                country: {
                    type: 'string'
                },
                postCode: {
                    type: 'string'
                },
                street: {
                    type: 'string'
                },
                additionalAddress: {
                    type: 'string'
                },
                house: {
                    type: 'string'
                },
            }
        }
    }
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
};

export const CompanySchema = {
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
        company: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
                address: {
                    type: 'string'
                },
                type: {
                    type: 'string'
                },
                owner: {
                    type: 'string'
                },
                capital: {
                    type: 'number'
                },
                business: {
                    type: 'string'
                },
                creationDate: {
                    type: 'string'
                },
                status: {
                    type: 'string'
                },
            }
        }
    }
};

export const ContactDetailsSchema = {
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
        contacts: {
            type: 'object',
            properties: {
                email: {
                    type: 'string'
                },
                phone: {
                    type: 'string'
                },
                cell: {
                    type: 'string'
                },
            }
        }
    }
};

export const InsuranceSchema = {
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
        insurance: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
                address: {
                    type: 'string'
                },
                accountNumber: {
                    type: 'string'
                },
                type: {
                    type: 'string'
                },
                startDate: {
                    type: 'string'
                },
                endDate: {
                    type: 'string'
                }
            }
        }
    }
};

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
};

export const UserDataCredentialsSchema = {
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
        contacts: {
            type: 'object',
            properties: {
                email: {
                    type: 'string'
                },
                phone: {
                    type: 'string'
                },
                cell: {
                    type: 'string'
                },
            }
        },
        personalData: {
            name: {
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
                    },
                }
            },
            dateOfBirth: {
                type: 'object',
                properties: {
                    date: {
                        type: 'string'
                    },
                    age: {
                        type: 'string'
                    },
                }
            },
            nationality: {
                type: 'string'
            },
            gender: {
                type: 'string'
            }
        },
        address: {
            type: 'object',
            properties: {
                city: {
                    type: 'string'
                },
                state: {
                    type: 'string'
                },
                country: {
                    type: 'string'
                },
                postCode: {
                    type: 'string'
                },
                street: {
                    type: 'string'
                },
                additionalAddress: {
                    type: 'string'
                },
                house: {
                    type: 'string'
                }
            }
        }
    }
};

export const Schemas = {
    [SchemaNames.ADDRESS]: AddressSchema,
    [SchemaNames.BANK_ACCOUNT]: BankAccountSchema,
    [SchemaNames.COMPANY]: CompanySchema,
    [SchemaNames.CONTACT_DETAILS]: ContactDetailsSchema,
    [SchemaNames.INSURANCE]: InsuranceSchema,
    [SchemaNames.PERSONAL_DATA]: PersonalDataSchema,
    [SchemaNames.USER_DATA_CREDENTIALS]: UserDataCredentialsSchema,
};
