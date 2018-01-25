var NotificationService = require("services/NotificationService");
var WaitScreenService   = require("services/WaitScreenService");

module.exports = (function($)
{
    const _eventListeners = {};

    $(document).ajaxComplete((ajaxEvent, xhr, options) =>
    {
        let response;

        try
        {
            response = JSON.parse(xhr.responseText);
        }
        catch (exception)
        {

        }

        if (response)
        {
            for (const event in response.events)
            {
                _triggerEvent(event, response.events[event]);
            }

            if (!options.supressNotifications)
            {
                _printMessages(response);
            }
        }
    });

    return {
        get     : _get,
        put     : _put,
        post    : _post,
        delete  : _delete,
        send    : _send,
        setToken: _setToken,
        getToken: _getToken,
        listen  : _listen
    };

    function _listen(event, handler)
    {
        _eventListeners[event] = _eventListeners[event] || [];
        _eventListeners[event].push(handler);
    }

    function _triggerEvent(event, payload)
    {
        if (_eventListeners[event])
        {
            for (let i = 0; i < _eventListeners[event].length; i++)
            {
                const listener = _eventListeners[event][i];

                if (typeof listener !== "function")
                {
                    continue;
                }
                listener.call(Object, payload);
            }
        }
    }

    function _get(url, data, config)
    {
        config = config || {};
        config.method = "GET";
        return _send(url, data, config);
    }

    function _put(url, data, config)
    {
        config = config || {};
        config.method = "PUT";
        return _send(url, data, config);
    }

    function _post(url, data, config)
    {
        config = config || {};
        config.method = "POST";
        return _send(url, data, config);
    }

    function _delete(url, data, config)
    {
        config = config || {};
        config.method = "DELETE";
        return _send(url, data, config);
    }

    function _send(url, data, config)
    {
        const deferred = $.Deferred();

        config = Object.assign(
            {
                data:                   null,
                dataType:               "json",
                contentType:            "application/x-www-form-urlencoded; charset=UTF-8",
                doInBackground:         false,
                supressNotifications:   false
            },
            config
        );

        if (!config.doInBackground)
        {
            WaitScreenService.showWaitScreen();
        }
        $.ajax(url, config)
            .done(response =>
            {
                deferred.resolve(response.data || response);
            })
            .fail(jqXHR =>
            {
                const response = jqXHR.responseText ? $.parseJSON(jqXHR.responseText) : {};

                deferred.reject(response);
            })
            .always(() =>
            {
                if (!config.doInBackground)
                {
                    WaitScreenService.hideWaitScreen();
                }
            });

        return deferred;
    }

    function _printMessages(response)
    {
        let notification;

        ["error", "success", "warning", "info"].forEach(logLevel =>
        {
            if (response[logLevel] && response[logLevel].message.length > 0)
            {
                notification = NotificationService[logLevel](response[logLevel]);
            }
        });

        if (notification && response.debug && response.debug.class.length > 0)
        {
            notification.trace(response.debug.file + "(" + response.debug.line + "): " + response.debug.class);
            for (let i = 0; i < response.debug.trace.length; i++)
            {
                notification.trace(response.debug.trace[i]);
            }
        }
    }

    function _setToken(token)
    {
        this._token = token;
    }

    function _getToken()
    {
        return this._token;
    }

})(jQuery);
