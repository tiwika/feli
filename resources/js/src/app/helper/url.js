import {isNullOrUndefined}from "./utils";

export function URL(path)
{
    if (isNullOrUndefined(path))
    {
        path = "";
    }

    const self = {
        join: _join,
        append: _append,
        toAbsolute: _toAbsolute,
        toRelative: _toRelative
    };

    return self;

    function _join(partial)
    {
        if (partial.charAt(0) !== "/")
        {
            path += "/";
        }
        path += partial;

        return self;
    }

    function _append(suffix)
    {
        path += suffix;

        return self;
    }

    function _toAbsolute()
    {
        if (path.charAt(0) !== "/")
        {
            return "/" + path;
        }

        return path;
    }

    function _toRelative()
    {
        if (path.charAt(0) === "/")
        {
            return path.substr(1);
        }

        return path;
    }
}
