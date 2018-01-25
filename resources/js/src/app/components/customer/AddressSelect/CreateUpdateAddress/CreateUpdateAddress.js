const NotificationService = require("services/NotificationService");

import ValidationService from "services/ValidationService";

Vue.component("create-update-address", {

    delimiters: ["${", "}"],

    props: [
        "addressData",
        "addressModal",
        "modalType",
        "addressType",
        "template"
    ],

    data()
    {
        return {
            waiting: false,
            addressFormNames:
            {
                1: "#billing_address_form",
                2: "#delivery_address_form"
            }
        };
    },

    computed:
    {
        addressList()
        {
            this.$store.getters.getAddressList(this.addressType);
        }
    },

    created()
    {
        this.$options.template = this.template;
    },

    methods: {
        /**
         * Validate the address fields
         */
        validate()
        {
            ValidationService.validate($(this.addressFormNames[this.addressType]))
                .done(() =>
                {
                    this.saveAddress();
                })
                .fail(invalidFields =>
                {
                    ValidationService.markInvalidFields(invalidFields, "error");
                });
        },

        /**
         * Save the new address or update an existing one
         */
        saveAddress()
        {
            if (this.modalType === "initial" || this.modalType === "create")
            {
                this.createAddress();
            }
            else if (this.modalType === "update")
            {
                this.updateAddress();
            }
        },

        /**
         * Update an address
         */
        updateAddress()
        {
            this.waiting = true;
            this._syncOptionTypesAddressData();

            this.$store.dispatch("updateAddress", {address: this.addressData, addressType: this.addressType})
                .then(
                    resolve =>
                    {
                        this.addressModal.hide();
                        this.waiting = false;
                    },
                    error =>
                    {
                        this.waiting = false;

                        if (error.validation_errors)
                        {
                            this._handleValidationErrors(error.validation_errors);
                        }
                    }
                );
        },

        /**
         * Create a new address
         */
        createAddress()
        {
            this.waiting = true;
            this._syncOptionTypesAddressData();

            this.$store.dispatch("createAddress", {address: this.addressData, addressType: this.addressType})
                .then(
                    response =>
                    {
                        this.addressModal.hide();
                        this.waiting = false;
                    },
                    error =>
                    {
                        this.waiting = false;

                        if (error.validation_errors)
                        {
                            this._handleValidationErrors(error.validation_errors);
                        }
                    }
                );
        },

        _handleValidationErrors(validationErrors)
        {
            ValidationService.markFailedValidationFields($(this.addressFormNames[this.addressType]), validationErrors);

            let errorMessage = "";

            for (const value of Object.values(validationErrors))
            {
                errorMessage += value + "<br>";
            }

            NotificationService.error(errorMessage);
        },

        _syncOptionTypesAddressData()
        {
            const typeMap = {
                1: "vatNumber",
                4: "telephone",
                9: "birthday",
                11: "title"
            };

            if (typeof this.addressData.options === "undefined")
            {
                return;
            }

            for (const optionType of this.addressData.options)
            {
                const mappedType = typeMap[optionType.typeId];

                if (this.addressData[mappedType] && this.addressData[mappedType] !== optionType.value)
                {
                    optionType.value = this.addressData[mappedType];
                }
            }
        },

        emitInputEvent(event)
        {
            this.$emit("input", event);
        }
    }
});
