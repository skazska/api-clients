import {ModelValidationResult, IModel, failure, success, GenericModel,
    IGenericModelOptions} from "@skazska/abstract-service-model";
import validator from 'validator';

export interface IClientKey {
    id :string
}

export interface IClientProps {
    locale :ValidatorJS.AlphanumericLocale,
    name :string
}

// class ClientSchema extends AbstractModelSchema<IClientKey, IClientProps> {
//     validateKey(key :IClientKey) :ModelValidationResult {
//         if (!validator.isUUID(key.id, 4))
//             return failure([ AbstractModelSchema.error('should be UUID v4', 'id') ]);
//         return success(true);
//     };
//     validateProperties(properties :IClientProps) :ModelValidationResult {
//         const result = new ModelValidationResult();
//         if (!validator.isLength(properties.name, {min: 3, max: 80})) {
//             result.error(AbstractModelSchema.error('data or data1 field should present', '*'));
//         }
//
//         //TODO check locale field
//
//         if (!validator.isAlphanumeric(properties.name, properties.locale)) {
//             result.error(AbstractModelSchema.error('data or data1 field should present', '*'));
//         }
//         return result;
//     };
//
// }
//
export class ClientModel extends GenericModel<IClientKey, IClientProps> implements IModel {
    constructor (key :IClientKey, properties :IClientProps) {
        super(key, properties, {
            // schema: new ClientSchema()
        });
    }

    protected setOptions(options: IGenericModelOptions<IClientKey, IClientProps>): any {
    }
}
