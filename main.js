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

// v 0.0.6 //

const PS_PATH = "https://rawgit.com/MatheusAvellar/plugSlack/master/resources/";
var ps, slackObj;
$.ajax({
type: "GET",
url: PS_PATH + "styles.css",
success: function(_ajxData) {

ps = {
    init: function() {
        $("head").append(
            "<link "
            +    " rel='stylesheet' "
            +    " type='text/css' "
            +    " href='" + PS_PATH + "styles.css'"
            + ">"
        );

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
            +    "</div>"
            +    "<div class='users-list'></div>"
            +"</div>"
        );

        $("div#chat-button, div#users-button, div#waitlist-button, div#friends-button").on("click", function() {
            $("div#ps-button").removeClass("selected");
            $("#ps-chat").hide();
        });

        $("div#ps-button").on("click", function() {
            $(".header-panel-button").removeClass("selected");
            $("#chat, #user-lists, #waitlist, div.app-right div.friends").hide();
            $("div#ps-button").addClass("selected");
        });
    },
    start: function() {
        var slackWS;
        $.ajax({
            type: "GET",
            url: "https://slack.com/api/rtm.start?token=" + window.prompt("Insert your token please!", "xxxx-xxxxxxxxx-xxxx"),
            success: function(data) {
                slackObj = data;
                for (var i = 0, l = slackObj.users.length; i < l; i++) {
                    if (!slackObj.users[i].deleted) {
                        ps.utils.appendUser(slackObj.users[i].name, slackObj.users[i].profile.image_32);
                    }
                }
                console.log("Connecting account " + slackObj.self.name);
                slackWS = new WebSocket(slackObj.url);

                slackWS.onopen = function(_data){
                    console.log("Successfully connected account " + slackObj.self.name);
                    console.log(_data);
                }

                slackWS.onmessage = function(_data){
                    console.log(_data);
                }

                slackWS.onerror = function(_data) {
                    console.log(_data);
                }
            },
            error: function(data) {
                console.log("Error authenticating");
                console.log(data);
            }
        }).done(function(data) {
            console.log("[Status: " + JSON.stringify(data.status) + "]");
        });
    },
    utils: {
        appendUser: function(username, imgURL) {
            $("div#ps-chat div.users-list").append(
                "<div class='user'>"
                +    "<div class='img' style='background: url(" + imgURL + ")'></div>"
                +    "<div class='username'>" + username + "</span>"
                +"</div>"
            );
        }
    }
};

ps.init();

},
error: function(msg) {
    API.chatLog("Error loading CSS! Try again later!");
}
});