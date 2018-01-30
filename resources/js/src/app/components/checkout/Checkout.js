const ApiService = require("services/ApiService");
const NotificationService = require("services/NotificationService");

import TranslationService from "services/TranslationService";

Vue.component("checkout", {

    props: [
        "template",
        "initialCheckout"
    ],

    computed: Vuex.mapState({
        checkout: state => state.checkout
    }),

    created: function()
    {
        this.$options.template = this.template;
        this.$store.dispatch("setCheckout", this.initialCheckout);

        ApiService.listen("CheckoutChanged", event =>
        {
            if (!this.isEquals(this.checkout.payment.methodOfPaymentList, event.checkout.paymentDataList, "id"))
            {
                NotificationService.info(
                    TranslationService.translate("Ceres::Template.orderMethodOfPaymentListChanged")
                );
                this.$store.commit("setMethodOfPaymentList", checkout.paymentDataList);
            }
        });

        ApiService.listen("CheckoutChanged", event =>
        {
            if (this.hasShippingProfileListChanged(this.checkout.shipping.shippingProfileList, event.checkout.shippingProfileList))
            {
                this.$store.commit("setShippingProfileList", event.checkout.shippingProfileList);
            }
        });

        ApiService.listen("CheckoutChanged", event =>
        {
            if (this.checkout.payment.methodOfPaymentId !== event.checkout.methodOfPaymentId)
            {
                NotificationService.warn(
                    TranslationService.translate("Ceres::Template.orderMethodOfPaymentChanged")
                );
                this.$store.commit("setMethodOfPayment", checkout.methodOfPaymentId);
            }
        });

        ApiService.listen("CheckoutChanged", event =>
        {
            if (this.checkout.shipping.shippingProfileId !== event.checkout.shippingProfileId)
            {
                NotificationService.warn(
                    TranslationService.translate("Ceres::Template.orderShippingProfileChanged")
                );
                this.$store.commit("setShippingProfile", checkout.shippingProfileId);
            }
        });

        ApiService.listen("CheckoutChanged", event =>
        {
            if (this.checkout.shipping.shippingCountryId !== event.checkout.shippingCountryId)
            {
                this.$store.commit("setShippingCountryId", event.checkout.shippingCountryId);
            }
        });
    },

    methods:
    {
        hasShippingProfileListChanged(oldList, newList)
        {
            if (oldList.length !== newList.length)
            {
                NotificationService.info(
                    TranslationService.translate("Ceres::Template.orderShippingProfileListChanged")
                );
                return true;
            }

            this.sortList(oldList, "parcelServicePresetId");
            this.sortList(newList, "parcelServicePresetId");

            for (const index in oldList)
            {
                if (oldList[index].parcelServicePresetId !== newList[index].parcelServicePresetId)
                {
                    NotificationService.info(
                        TranslationService.translate("Ceres::Template.orderShippingProfileListChanged")
                    );
                    return true;
                }
                else if (oldList[index].shippingAmount !== newList[index].shippingAmount)
                {
                    NotificationService.info(
                        TranslationService.translate("Ceres::Template.orderShippingProfilePriceChanged")
                    );
                    return true;
                }
            }

            return false;
        },

        isEquals(oldList, newList, fieldToCompare)
        {
            if (oldList.length !== newList.length)
            {
                return false;
            }

            for (const oldListItem of oldList)
            {
                if (newList.findIndex(newListItem => newListItem[fieldToCompare] === oldListItem[fieldToCompare]) === -1)
                {
                    return false;
                }
            }

            return true;
        },

        sortList(list, field)
        {
            list.sort((valueA, valueB) =>
            {
                if (valueA[field] > valueB[field])
                {
                    return 1;
                }

                if (valueA[field] < valueB[field])
                {
                    return -1;
                }

                return 0;
            });
        }
    }
});
