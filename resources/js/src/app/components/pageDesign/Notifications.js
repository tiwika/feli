import ExceptionMap from "exceptions/ExceptionMap";

const NotificationService = require("services/NotificationService");

Vue.component("notifications", {

    delimiters: ["${", "}"],

    props: [
        "initialNotifications",
        "template"
    ],

    data: function()
    {
        return {
            notifications: []
        };
    },

    created: function()
    {
        this.$options.template = this.template;
    },

    mounted: function()
    {
        this.$nextTick(() =>
        {
            NotificationService.listen(
                notifications =>
                {
                    Vue.set(this, "notifications", notifications);
                });

            this.showInitialNotifications();
        });
    },

    methods : {
        /**
         * Dissmiss the notification
         * @param notification
         */
        dismiss: function(notification)
        {
            NotificationService.getNotifications().remove(notification);
        },

        /**
         * show initial notifications from server
         */
        showInitialNotifications: function()
        {
            this.initialNotification.forEach(
                function(notification)
                {
                    // set default type to 'log'
                    const type        = notification.type || "log";
                    const messageCode = notification.code;
                    let message       = notification.message;

                    if (messageCode > 0)
                    {
                        message = Translations.Template[ExceptionMap.get(messageCode.toString())];
                    }

                    // type cannot be undefined
                    if (message)
                    {
                        if (NotificationService[type] && typeof NotificationService[type] === "function")
                        {
                            NotificationService[type](message);
                        }
                        else
                        {
                            // unkown type
                            NotificationService.log(message);
                        }
                    }
                }
            );
        }
    }
});
