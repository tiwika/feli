import {URL}from "../helper/url";

Vue.filter("itemURL", function(item)
{
    const enableOldUrlPattern   = App.config.enableOldUrlPattern === "true";
    const url                   = new URL(item.texts.urlPath);
    let suffix                  = "";

    if (enableOldUrlPattern)
    {
        suffix = "/a-" + item.item.id;
    }
    else
    {
        suffix = "_" + item.item.id + "_" + item.variation.id;
    }

    const link = url.toAbsolute();

    if (link.substr(link.length - suffix.length, suffix.length) === suffix)
    {
        return link;
    }

    return link + suffix;
});
