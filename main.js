/*
 *               [plugSlack]
 *   Cause only plug wasn't good enough
 *
 * Coded by Matheus Avellar ("Beta Tester")
 *
 * Most of the stuff here is probably not
 * the most efficient. But it works. So who cares.
 *
 */

"use strict";

const PS_PATH = "https://rawgit.com/MatheusAvellar/plugSlack/master/resources/";

var ps = {
    init: function() {
        $("head").append(
            "<link "
            +    " rel='stylesheet' "
            +    " type='text/css' "
            +    " href='" + PS_PATH + "styles.css'"
            + ">"
        );

        $("div#header-panel-bar").append(
            "<div id='slack-button' class='header-panel-button notify'>"
            +    "<i class='icon icon-star-white'></i>"
            +    "<span class='request-count'>0</span>"
            +"</div>"
        );

        $("div#slack-button").on("click", function() {
            $(".header-panel-button").removeClass("selected");
            $("#chat, #user-lists, #waitlist, div.app-right div.friends").css({"display":"none"});
            $("div#slack-button").addClass("selected");
        });
    }
};

ps.init();