module.exports = (function($)
{

    var notificationCount = 0;
    var notifications     = new NotificationList();

    var handlerList = [];

    return {
        log             : _log,
        info            : _info,
        warn            : _warn,
        error           : _error,
        success         : _success,
        getNotifications: getNotifications,
        listen          : _listen
    };

    function _listen(handler)
    {
        handlerList.push(handler);
    }

    function trigger()
    {
        for (let i = 0; i < handlerList.length; i++)
        {
            handlerList[i].call({}, notifications.all());
        }
    }

    function _log(message, prefix)
    {
        const notification = new Notification(message);

        if (App.config.logMessages)
        {
            // eslint-disable-next-line
            console.log((prefix || "") + "[" + notification.code + "] " + notification.message);

            for (let i = 0; i < notification.stackTrace.length; i++)
            {
                _log(notification.stackTrace[i], " + ");
            }
        }

        return notification;
    }

    function _info(message)
    {
        const notification = new Notification(message, "info");

        if (App.config.printInfos)
        {
            _printNotification(notification);
        }

        return notification;
    }

    function _warn(message)
    {
        const notification = new Notification(message, "warning");

        if (App.config.printWarnings)
        {
            _printNotification(notification);
        }

        return notification;
    }

    function _error(message)
    {
        const notification = new Notification(message, "danger");

        if (App.config.printErrors)
        {
            _printNotification(notification);
        }

        return notification;
    }

    function _success(message)
    {
        const notification = new Notification(message, "success");

        if (App.config.printSuccess)
        {
            _printNotification(notification);
        }

        return notification;
    }

    function getNotifications()
    {
        return notifications;
    }

    function _printNotification(notification)
    {
        notifications.add(notification);
        _log(notification);

        trigger();

        return notification;
    }

    function Notification(data, context)
    {
        if (!App.config.printStackTrace && typeof (data) === "object")
        {
            data.stackTrace = [];
        }
        const id   = notificationCount++;
        const defaultData = Object.assign(
            {
                code:       0,
                msssage:    "",
                stackTrace: []
            },
            data
        );

        const self = {
            id        : id,
            code      : defaultData.code,
            message   : defaultData.message,
            context   : context || "info",
            stackTrace: defaultData.stackTrace,
            close     : close,
            closeAfter: closeAfter,
            trace     : trace
        };

        return self;

        function close()
        {
            notifications.remove(self);
            trigger();
        }

        function closeAfter(timeout)
        {
            setTimeout(function()
            {
                notifications.remove(self);
                trigger();
            }, timeout);
        }

        function trace(message, code)
        {
            if (App.config.printStackTrace)
            {
                self.stackTrace.push({
                    code   : code || 0,
                    message: message
                });
            }
        }
    }

    function NotificationList()
    {
        const elements = [];

        return {
            all   : all,
            add   : add,
            remove: remove
        };

        function all()
        {
            return elements;
        }

        function add(notification)
        {
            elements.push(notification);
        }

        function remove(notification)
        {
            for (let i = 0; i < elements.length; i++)
            {
                if (elements[i].id === notification.id)
                {
                    elements.splice(i, 1);
                    break;
                }
            }
        }
    }

})(jQuery);
