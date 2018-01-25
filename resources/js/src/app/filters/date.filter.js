// for docs see https://github.com/brockpetrie/vue-moment

const dateFilter = function()
{
    const args = Array.prototype.slice.call(arguments);
    const input = args.shift();
    let date;

    if (isNaN(new Date(input).getTime()))
    {
        return input;
    }

    if (Array.isArray(input) && typeof input[0] === "string")
    {
        // If input is array, assume we're being passed a format pattern to parse against.
        // Format pattern will accept an array of potential formats to parse against.
        // Date string should be at [0], format pattern(s) should be at [1]
        date = moment(input[0], input[1], true);
    }
    else
    {
        // Otherwise, throw the input at moment and see what happens...
        date = moment(input);
    }

    if (!date.isValid())
    {
        // Log a warning if moment couldn't reconcile the input. Better than throwing an error?
        console.warn("Could not build a valid `moment` object from input.");
        return input;
    }

    const parsers = {};

    parsers.add = function(args)
    {
        // Mutates the original moment by adding time.
        // http://momentjs.com/docs/#/manipulating/add/

        const addends = args.shift()
            .split(",")
            .map(Function.prototype.call, String.prototype.trim);

        const obj = {};

        for (let aId = 0; aId < addends.length; aId++)
        {
            const addend = addends[aId].split(" ");

            obj[addend[1]] = addend[0];
        }

        date = date.add(obj);
    };

    parsers.subtract = function(args)
    {
        // Mutates the original moment by subtracting time.
        // http://momentjs.com/docs/#/manipulating/subtract/

        const subtrahends = args.shift()
            .split(",")
            .map(Function.prototype.call, String.prototype.trim);

        const obj = {};

        for (let sId = 0; sId < subtrahends.length; sId++)
        {
            const subtrahend = subtrahends[sId].split(" ");

            obj[subtrahend[1]] = subtrahend[0];
        }
        date = date.subtract(obj);
    };

    parsers.from = function(args)
    {
        // Display a moment in relative time, either from now or from a specified date.
        // http://momentjs.com/docs/#/displaying/fromnow/

        let from = "now";

        if (args[0] === "now") args.shift();

        if (moment(args[0]).isValid())
        {
            // If valid, assume it is a date we want the output computed against.
            from = moment(args.shift());
        }

        let removeSuffix = false;

        if (args[0] === true)
        {
            args.shift();
            removeSuffix = true;

        }

        if (from !== "now")
        {
            date = date.from(from, removeSuffix);
            return;
        }

        date = date.fromNow(removeSuffix);
    };

    parsers.calendar = function(args)
    {
        // Formats a date with different strings depending on how close to a certain date (today by default) the date is.
        // http://momentjs.com/docs/#/displaying/calendar-time/

        let referenceTime = moment();

        if (moment(args[0]).isValid())
        {
            // If valid, assume it is a date we want the output computed against.
            referenceTime = moment(args.shift());
        }

        date = date.calendar(referenceTime);
    };

    function parse()
    {
        const args = Array.prototype.slice.call(arguments);
        const method = args.shift();

        if (parsers.hasOwnProperty(method))
        {
            parsers[method].apply(null, args);
        }
        else
        {
            date = date.format(method);
        }

        if (args.length) parse.apply(parse, args);
    }

    parse.apply(parse, args);

    return date;
};

Vue.filter("moment", dateFilter);
Vue.filter("date", dateFilter);
