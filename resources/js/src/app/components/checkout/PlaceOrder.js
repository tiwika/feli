const ApiService = require("services/ApiService");
const NotificationService = require("services/NotificationService");

import TranslationService from "services/TranslationService";

Vue.component("place-order", {

    delimiters: ["${", "}"],

    props: [
        "targetContinue",
        "template"
    ],

    data()
    {
        return {
            waiting: false
        };
    },

    computed: Vuex.mapState({
        checkoutValidation: state => state.checkout.validation,
        contactWish: state => state.checkout.contactWish,
        isBasketLoading: state => state.basket.isBasketLoading
    }),

    created()
    {
        this.$options.template = this.template;
    },

    methods: {
        placeOrder()
        {
            this.waiting = true;

            if (this.contactWish && this.contactWish.length > 0)
            {
                ApiService.post("/rest/io/order/contactWish", {orderContactWish: this.contactWish}, {supressNotifications: true})
                    .always(() =>
                    {
                        this.preparePayment();
                    });
            }
            else
            {
                this.preparePayment();
            }
        },

        preparePayment()
        {
            this.waiting = true;

            if (this.validateCheckout())
            {
                ApiService.post("/rest/io/checkout/payment")
                    .done(response =>
                    {
                        this.afterPreparePayment(response);
                    })
                    .fail(error =>
                    {
                        this.waiting = false;
                    });
            }
            else
            {
                NotificationService.error(
                    TranslationService.translate("Ceres::Template.generalCheckEntries")
                );
                this.waiting = false;
            }
        },

        validateCheckout()
        {
            let isValid = true;

            for (const index in this.checkoutValidation)
            {
                if (this.checkoutValidation[index].validate)
                {
                    this.checkoutValidation[index].validate();

                    if (this.checkoutValidation[index].showError)
                    {
                        isValid = !this.checkoutValidation[index].showError;
                    }
                }
            }

            return isValid;
        },

        afterPreparePayment(response)
        {
            let paymentValue = response.value || "";

            if (response.type)
            {
                paymentValue = "Unknown response from payment provider: " + response.type;
            }

            if (response.type === "continue" && this.targetContinue)
            {
                paymentValue = this.targetContinue;
            }

            if (paymentValue)
            {
                this.handlePaymentCallback(response.type, paymentValue);
            }
        },

        handlePaymentCallback(type, value)
        {
            switch (type)
            {
            case "continue":
            case "redirectUrl":
                window.location.assign(value);
                break;
            case "externalContentUrl":
            case "htmlContent":
                // show external content in iframe
                this.showModal(value, type === "externalContentUrl");
                break;
            default:
                NotificationService.error(value);
                this.waiting = false;
                break;
            }
        },

        showModal(content, isExternalContent)
        {
            const $modal        = $(this.$refs.modal);
            const $modalBody    = $(this.$refs.modalContent);

            if (isExternalContent)
            {
                $modalBody.html("<iframe src=\"" + content + "\">");
            }
            else
            {
                $modalBody.html(content);
            }

            $modal.modal("show");
        }
    }
});
