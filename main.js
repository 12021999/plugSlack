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

const version = "v0.0.39";
const PS_PATH = "https://rawgit.com/MatheusAvellar/plugSlack/master/resources/";
var ps = {};
var _all = {
    users: {},
    channels: {}
};
var slackObj, slackWS, tkn, cn;

$.ajax({
type: "GET",
url: PS_PATH + "styles.css",
success: function(_ajxData) {
    $("head").append(
        "<link "
        +    " rel='stylesheet' "
        +    " type='text/css' "
        +    " href='" + PS_PATH + "styles.css'"
        + ">"
    );

ps = {
    you: {},
    init: function() {
        API.chatLog(version);
        $.getScript(PS_PATH + "start.js");
        $.getScript(PS_PATH + "format.js");
        $.getScript(PS_PATH + "loadHistory.js");
        $.getScript(PS_PATH + "fixTime.js");
        $.getScript(PS_PATH + "appendMessage.js");
        $.getScript(PS_PATH + "appendItem.js");
        $.getScript(PS_PATH + "appendItem.js");

        $("div#header-panel-bar").append(
            "<div id='ps-button' class='header-panel-button notify'>"
            +    "<i class='icon icon-star-white'></i>"
            +    "<span class='request-count'>0</span>"
            +"</div>"
        );

        $(".app-right").append(
            "<div id='ps-chat'>"
            +    "<div id='ps-header'>"
            +        "<div id='ps-channels-button' class='ps-btn'>channels</div>"
            +        "<div id='ps-users-button' class='ps-btn selected'>users</div>"
            +        "<div id='ps-groups-button' class='ps-btn'>groups</div>"
            +    "</div>"
            +    "<div class='channels-list ps-list'></div>"
            +    "<div class='users-list ps-list'></div>"
            +    "<div class='groups-list ps-list'></div>"
            +    "<div id='ps-actual-chat'></div>"
            +    "<div class='ps-start' onclick='return ps.start();'>"
            +         "<input id='ps-token' placeholder='Insert your token here!'>"
            +         "Start plugSlack"
            +    "</div>"
            +    "<input id='ps-submit' />"
            +"</div>"
        );

        $("div.ps-btn").on("click", function() {
            $("div.ps-btn").removeClass("selected");
            $("div.ps-list").hide();
            $(this).addClass("selected");
            const _sel = $(this).attr("id") == "ps-channels-button" ? "div.channels-list" :
                       $(this).attr("id") == "ps-users-button" ? "div.users-list" : "div.groups-list";
            $(_sel).show();
        });

        $("div#chat-button, div#users-button, div#waitlist-button, div#friends-button").on("click", function() {
            $("div#ps-button").removeClass("selected");
            $("#ps-chat").hide();
        });

        $("div#ps-button").on("click", function() {
            $(".header-panel-button").removeClass("selected");
            $("#chat, #user-lists, #waitlist, div.app-right div.friends").hide();
            $("#ps-chat").show();
            $("div#ps-button").addClass("selected");
        });
    },
    utils: {}
};

ps.init();

},
error: function(msg) {
    API.chatLog("Error loading CSS! Try again later!");
}
});