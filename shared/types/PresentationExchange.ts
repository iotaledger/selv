export type PresentationDefinitionV2 = {
    id: string;
    input_descriptors: {
        name?: string;
        description?: string;
        purpose?: string;
        format?: any;
        id: string;
        constraints: {
            fields?: {
                id?: string;
                purpose?: string;
                name?: string;
                path: string[];
                filter?: string; //unsure about this one
                optional?: boolean;
            }
            limit_disclosure: {
                required?: boolean;
                preferred?: boolean;
            }
        }[]
    }[]
}