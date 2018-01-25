// Frontend end scripts
// eslint-disable-next-line
(function($, window, document)
{
    $(window).scroll(function()
    {
        const $wrapperMain = $(".wrapper-main");

        if ($wrapperMain.hasClass("isSticky"))
        {
            if ($(this).scrollTop() > 1)
            {
                $wrapperMain.addClass("sticky");
            }
            else
            {
                $wrapperMain.removeClass("sticky");
            }
        }
    });

    // init bootstrap tooltips
    $("[data-toggle=\"tooltip\"]").tooltip();

    // Replace all SVG images with inline SVG, class: svg
    $("img[src$=\".svg\"]").each(function()
    {
        const $img = jQuery(this);
        const imgURL = $img.attr("src");
        const attributes = $img.prop("attributes");

        $.get(imgURL, function(data)
        {
            // Get the SVG tag, ignore the rest
            const $svg = jQuery(data).find("svg");

            // Remove any invalid XML tags
            $svg.removeAttr("xmlns:a");

            // Loop through IMG attributes and apply on SVG
            $.each(attributes, function()
            {
                $svg.attr(this.name, this.value);
            });

            // Replace IMG with SVG
            $img.replaceWith($svg);
        }, "xml");
    });

    const $toggleListView = $(".toggle-list-view");
    const $mainNavbarCollapse = $("#mainNavbarCollapse");

    $(document).on("click", function(evt)
    {
        const $vueApp = $("#vue-app");

        if ($vueApp.hasClass("open-right") &&
            !evt.target.classList.contains("basket-preview") &&
            !evt.target.classList.contains("message") &&
            $(evt.target).parents(".basket-preview").length <= 0)
        {
            evt.preventDefault();
            $vueApp.toggleClass("open-right");
        }

        const $countrySettings = $("#countrySettings");

        if (evt.target.id !== "countrySettings" &&
            $(evt.target).parents("#countrySettings").length <= 0 &&
            $countrySettings.attr("aria-expanded") === "true")
        {
            $countrySettings.collapse("hide");
        }

        const $searchBox = $("#searchBox");

        if (evt.target.id !== "searchBox" &&
            $(evt.target).parents("#searchBox").length <= 0 &&
            $searchBox.attr("aria-expanded") === "true")
        {
            $searchBox.collapse("hide");
        }

        const $currencySelect = $("#currencySelect");

        if (evt.target.id !== "currencySelect" &&
            $(evt.target).parents("#currencySelect").length <= 0 &&
            $currencySelect.attr("aria-expanded") === "true")
        {
            $currencySelect.collapse("hide");
        }
    });

    $toggleListView.on("click", function(evt)
    {
        evt.preventDefault();

        // toggle it's own state
        $toggleListView.toggleClass("grid");

        // toggle internal style of thumbs
        $(".product-list, .cmp-product-thumb").toggleClass("grid");
    });

    $mainNavbarCollapse.collapse("hide");

    // Add click listener outside the navigation to close it
    $mainNavbarCollapse.on("show.bs.collapse", function()
    {
        $(".main").one("click", closeNav);
    });

    $mainNavbarCollapse.on("hide.bs.collapse", function()
    {
        $(".main").off("click", closeNav);
    });

    function closeNav()
    {
        $("#mainNavbarCollapse").collapse("hide");
    }

    $(document).ready(function()
    {
        const offset = 250;
        const duration = 300;

        let isDesktop = window.matchMedia("(min-width: 768px)").matches;

        const $backToTop = $(".back-to-top");
        const $backToTopCenter = $(".back-to-top-center");

        $(window).scroll(function()
        {
            if (isDesktop)
            {
                if ($(this).scrollTop() > offset)
                {
                    $backToTop.fadeIn(duration);
                    $backToTopCenter.fadeIn(duration);
                }
                else
                {
                    $backToTop.fadeOut(duration);
                    $backToTopCenter.fadeOut(duration);
                }
            }
        });

        window.addEventListener("resize", function()
        {
            isDesktop = window.matchMedia("(min-width: 768px)").matches;
        });

        $backToTop.click(function(event)
        {
            event.preventDefault();

            $("html, body").animate({scrollTop: 0}, duration);

            return false;
        });

        $backToTopCenter.click(function(event)
        {
            event.preventDefault();

            $("html, body").animate({scrollTop: 0}, duration);

            return false;
        });

        $("#searchBox").on("show.bs.collapse", function()
        {
            $("#countrySettings").collapse("hide");
        });

        $("#countrySettings").on("show.bs.collapse", function()
        {
            $("#searchBox").collapse("hide");
        });

        $("#accountMenuList").click(function()
        {
            $("#countrySettings").collapse("hide");
            $("#searchBox").collapse("hide");
        });
    });

})(jQuery, window, document);
