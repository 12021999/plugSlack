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

const version = "v0.0.20";
const PS_PATH = "https://rawgit.com/MatheusAvellar/plugSlack/master/resources/";
var ps, slackObj;
$.ajax({
type: "GET",
url: PS_PATH + "styles.css",
success: function(_ajxData) {
    console.log("Successfully loaded the CSS");
    $("head").append(
        "<link "
        +    " rel='stylesheet' "
        +    " type='text/css' "
        +    " href='" + PS_PATH + "styles.css'"
        + ">"
    );

ps = {
    init: function() {
        API.chatLog(version);
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
    start: function() {
        var slackWS;
        var allUsers = {};
        if ($("input#ps-token").val()) {
            $.ajax({
                type: "GET",
                url: "https://slack.com/api/rtm.start?token=" + $("input#ps-token").val(),
                success: function(data) {
                    $("div.ps-start").remove();
                    slackObj = data;
                    for (var i = 0, l = slackObj.users.length; i < l; i++) {
                        if (!slackObj.users[i].deleted) {
                            ps.utils.appendItem(slackObj.users[i].name,
                                slackObj.users[i].id,
                                "user",
                                slackObj.users[i].presence);
                            allUsers[slackObj.users[i].id] = slackObj.users[i].name;
                        }

                    }
                    for (var i = 0, l = slackObj.channels.length; i < l; i++) {
                        if (!slackObj.channels[i].is_archived && slackObj.channels[i].is_member) {
                            ps.utils.appendItem(slackObj.channels[i].name,
                                slackObj.channels[i].id,
                                "channel");
                        }
                    }
                    for (var i = 0, l = slackObj.groups.length; i < l; i++) {
                        if (!slackObj.groups[i].is_archived) {
                            ps.utils.appendItem(slackObj.groups[i].name,
                                slackObj.groups[i].id,
                                "group");
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
                        if (_data.type == "message") {
                            const d = new Date();
                            const h = d.getHours();
                            const m = d.getMinutes();
                            if (h < 10) {  h = "0" + h;  }
                            if (m < 10) {  m = "0" + m;  }
                            const _d = JSON.parse(_data.data);
                            ps.utils.appendMessage(_d.user, _d.channel, _d.text, h + ":" + m);
                        }
                        
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
        } else {
            console.log("Please insert a token");
        }
    },
    utils: {
        appendItem: function(name, id, tag, isOnline) {
            if (tag == "channel") {
                $("div#ps-chat div.channels-list").append(
                    "<div class='channel'>"
                    +    "<div class='channelName'>" + name + "</div>"
                    +"</div>"
                );
            } else if (tag == "user") {
                $("div#ps-chat div.users-list").append(
                    "<div class='user'>"
                    +    "<div class='presence " + isOnline + "'></div>"
                    +    "<div class='username'>" + name + "</div>"
                    +"</div>"
                );
            } else {
                $("div#ps-chat div.groups-list").append(
                    "<div class='group'>"
                    +    "<div class='groupName'>" + name + "</div>"
                    +"</div>"
                );
            }
        },
        appendMessage: function(from, channel, message, time) {
            if (message) {
                from = !from ? "" : from;
                message = message.split("<").join("&lt;").split(">").join("&gt;");
                const _c = $("div#ps-actual-chat")
                const _scroll = _c[0].scrollTop > _c[0].scrollHeight -_c.height() - 28;
                $("#ps-actual-chat").append(
                    "<div class='ps-message'>"
                    +    "<div class='ps-meta'>"
                    +        "<div class='ps-from'>" + allUsers[from] + "</div>"
                    +        "<div class='ps-time'>" + time + "</div>"
                    +        "<div class='ps-channel'>" + channel + "</div>"
                    +    "</div>"
                    +    "<div class='ps-text'>" + message + "</div>"
                    +"</div>"
                );
                if (_scroll) {
                    $("div#ps-actual-chat")[0].scrollTop = _c[0].scrollHeight;
                }
            }
        }
    }
};

ps.init();

},
error: function(msg) {
    API.chatLog("Error loading CSS! Try again later!");
}
});