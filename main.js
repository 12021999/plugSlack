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

        $(".app-right").append(
            "<div id='slack-chat'>"
            +    "<div id='slack-header'>"
            +        "<div id='channels-button' class='slack-button'>channels</div>"
            +        "<div id='users-button' class='slack-button selected'>users</div>"
            +    "</div>"
            +    "<div class='users-list'></div>"
            +"</div>"
        );

        $(".header-panel-button").on("click", function() {
            $("div#slack-button").removeClass("selected");
            $("#slack-chat").hide();
        });

        $("div#slack-button").on("click", function() {
            $(".header-panel-button").removeClass("selected");
            $("#chat, #user-lists, #waitlist, div.app-right div.friends").hide();
            $("div#slack-button").addClass("selected");
        });
    },
    utils: {
        appendUser: function(username, imgURL) {
            $("div#slack-chat div.users-list").append(
                "<div class='user'>"
                +    "<div class='img' style='background: url(" + imgURL + ")'></div>"
                +    "<div class='username'>" + username + "</span>"
                +"</div>"
            );
        }
    }
};

ps.init();

var slackWS;
$.ajax({
    type: "GET",
    /*contentType: "application/json",*/
    url: "https://slack.com/api/rtm.start?token=" + "xoxp-2231677876-3178257956-8220839974-7e0386",
    success: function(data) {
        console.log(data);
        console.log("Connecting account " + data.self.name);
        /*slackWS = new WebSocket(data.url);

        slackWS.onopen() = function(){
            console.log("Successfully connected account " + data.self.name);
        }

        slackWS.onmessage() = function(msg){
            alert(msg);
        }*/
    },
    error: function(data) {
        console.log("Error authenticating");
        console.log(data);
    }
}).done(function(data) {
    console.log("[Status: " + JSON.stringify(data.status) + "]");
});