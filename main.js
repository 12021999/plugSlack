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

const version = "v0.0.25";
const PS_PATH = "https://rawgit.com/MatheusAvellar/plugSlack/master/resources/";
var ps, slackObj;
var _all = {
    users: {},
    channels: {}
};

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
        if ($("input#ps-token").val().trim()) {
            $.ajax({
                type: "GET",
                url: "https://slack.com/api/rtm.start?token=" + $("input#ps-token").val().trim(),
                success: function(data) {
                    $("div.ps-start").remove();
                    slackObj = data;
                    for (var i = 0, l = slackObj.users.length; i < l; i++) {
                        if (!slackObj.users[i].deleted) {
                            ps.utils.appendItem(
                                {
                                    name: slackObj.users[i].name,
                                    id: slackObj.users[i].id,
                                    tag: "user",
                                    status: slackObj.users[i].presence
                                }
                            );
                            _all.users[slackObj.users[i].id] = {
                                name: slackObj.users[i].name,
                                prof: slackObj.users[i].profile
                            }
                        }

                    }
                    for (var i = 0, l = slackObj.channels.length; i < l; i++) {
                        if (!slackObj.channels[i].is_archived && slackObj.channels[i].is_member) {
                            ps.utils.appendItem(
                                {
                                    name: slackObj.channels[i].name,
                                    id: slackObj.channels[i].id,
                                    tag: "channel"
                                }
                            );
                            _all.channels[slackObj.channels[i].id] = slackObj.channels[i].name;
                        }
                    }
                    for (var i = 0, l = slackObj.groups.length; i < l; i++) {
                        if (!slackObj.groups[i].is_archived) {
                            ps.utils.appendItem(
                                {
                                    name: slackObj.groups[i].name,
                                    id: slackObj.groups[i].id,
                                    tag: "group"
                                }
                            );
                            _all.channels[slackObj.groups[i].id] = slackObj.groups[i].name;
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
                            console.log(_d);
                            ps.utils.appendMessage(
                                {
                                    id: _d.user,
                                    name: _all.users[_d.user].name,
                                    prof: _all.users[_d.user].prof.image_32,
                                    cid: _d.channel,
                                    channel: _all.channels[_d.channel],
                                    message: _d.text,
                                    time: h + ":" + m
                                }
                            );
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
        appendItem: function(obj) {
            if (obj.tag == "channel") {
                $("div#ps-chat div.channels-list").append(
                    "<div class='channel' ps-cid='" + obj.id + "'>"
                    +    "<div class='channelName'>" + obj.name + "</div>"
                    +"</div>"
                );
            } else if (obj.tag == "user") {
                $("div#ps-chat div.users-list").append(
                    "<div class='user' ps-uid='" + obj.id + "'>"
                    +    "<div class='presence " + obj.status + "'></div>"
                    +    "<div class='username'>" + obj.name + "</div>"
                    +"</div>"
                );
            } else {
                $("div#ps-chat div.groups-list").append(
                    "<div class='group' ps-cid='" + obj.id + "'>"
                    +    "<div class='groupName'>" + obj.name + "</div>"
                    +"</div>"
                );
            }
        },
        appendMessage: function(obj) {
            if (obj.message) {
                obj.from = !obj.from ? "" : obj.from;
                obj.message = obj.message.split("<").join("&lt;").split(">").join("&gt;");
                const _c = $("div#ps-actual-chat")
                const _scroll = _c[0].scrollTop > _c[0].scrollHeight -_c.height() - 28;
                $("#ps-actual-chat").append(
                    "<div class='ps-message'>"
                    +    "<div class='ps-prof' style='background: url(" + obj.prof + ");'></div>"
                    +    "<div class='ps-meta'>"
                    +        "<div class='ps-from' ps-id='" + obj.id + "'>" + obj.name + "</div>"
                    +        "<div class='ps-time'>" + time + "</div>"
                    +        "<div class='ps-channel' ps-cid='" + obj.cid + "'>" + obj.channel + "</div>"
                    +    "</div>"
                    +    "<div class='ps-text'>" + obj.message + "</div>"
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