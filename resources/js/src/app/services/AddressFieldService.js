import {isNullOrUndefined}from "../helper/utils";

export function isAddressFieldEnabled(countryId, addressType, field)
{
    let address = {};
    let enabledFields = {};

    if (isNullOrUndefined(countryId))
    {
        countryId = 1;
    }

    if (parseInt(addressType) === 1)
    {
        address = "billing_address";

        if (parseInt(countryId) === 1)
        {
            enabledFields = App.config.enabledBillingAddressFields;
        }
        else
        {
            enabledFields = App.config.enabledBillingAddressFieldsUK;
        }
    }
    else
    {
        address = "delivery_address";

        if (parseInt(countryId) === 1)
        {
            enabledFields = App.config.enabledDeliveryAddressFields;
        }
        else
        {
            enabledFields = App.config.enabledDeliveryAddressFieldsUK;
        }
    }

    enabledFields = enabledFields.split(", ");

    const fullField = address + "." + field;

    return enabledFields.some(enabledField => enabledField === fullField);
}

export default {isAddressFieldEnabled};
