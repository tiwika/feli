import $ from "jquery";

export function getUrlParams(urlParams)
{
    if (urlParams)
    {
        let tokens;
        const params = {};
        const regex = /[?&]?([^=]+)=([^&]*)/g;

        urlParams = urlParams.split("+").join(" ");

        while ((tokens = regex.exec(urlParams)) !== null)
        {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }

    return {};
}

export function setUrlParams(urlParams)
{
    const pathName = window.location.pathname;
    const params = $.isEmptyObject(urlParams) ? "" : "?" + $.param(urlParams);
    const titleElement = document.getElementsByTagName("title")[0];

    window.history.replaceState({}, titleElement ? titleElement.innerHTML : "", pathName + params);
}

export function setUrlParam(key, value)
{
    const urlParams = getUrlParams(document.location.search);

    if (value !== null)
    {
        urlParams[key] = value;
    }
    else
    {
        delete urlParams[key];
    }

    setUrlParams(urlParams);
}

export default {setUrlParam, setUrlParams, getUrlParams};
