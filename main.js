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

const version = "v0.0.34";
const PS_PATH = "https://rawgit.com/MatheusAvellar/plugSlack/master/resources/";
var ps, slackObj, tkn, cn;
var _all = {
    users: {},
    channels: {}
};

$.ajax({
type: "GET",
url: PS_PATH + "styles.css",
success: function(_ajxData) {
    //console.log("Successfully loaded the CSS");
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
        tkn = $("input#ps-token").val().trim();
        if (tkn) {
            $.ajax({
                type: "GET",
                url: "https://slack.com/api/rtm.start?token=" + tkn,
                success: function(data) {
                    $("div.ps-start").remove();
                    slackObj = data;
                    for (var i = 0, l = slackObj.users.length; i < l; i++) {
                        console.log("A");
                        if (!slackObj.users[i].deleted) {
                            console.log("B");
                            for (var j = 0, k = slackObj.ims.length; j < k; j++) {
                                console.log("C");
                                if (slackObj.users[i].id == slackObj.ims[j].user) {
                                    console.log("D");
                                    ps.utils.appendItem(
                                        {
                                            name: slackObj.users[i].name,
                                            id: slackObj.users[i].id,
                                            ims: slackObj.ims[j].id,
                                            tag: "user",
                                            status: slackObj.users[i].presence
                                        }
                                    );
                                    _all.users[slackObj.users[i].id] = {
                                        name: slackObj.users[i].name,
                                        prof: slackObj.users[i].profile
                                    }
                                    break
                                } else if (slackObj.users[i].name == slackObj.self.name) {
                                    console.log("----E----");
                                    console.log(i);
                                    console.log(slackObj.users[i].id);
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
                                    break;
                                }
                            }
                        }
                    }
                    $("div.users-list div.user[ps-uid^='USLACKBOT']").addClass("selected");
                    ps.utils.loadHistory(slackObj.ims[0].id);
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

                    $("div#ps-chat div.channels-list div.channel, "
                    + "div#ps-chat div.users-list div.user, "
                    + "div#ps-chat div.groups-list div.group").on("click", function() {
                        if (!$(this).hasClass("selected")) {
                            $("div.channel.selected, "
                            + "div.user.selected, "
                            + "div.group.selected").removeClass("selected");
                            $("div.ps-message").remove();
                            $(this).addClass("selected");
                            cn = $(this).attr("ps-cid");
                            ps.utils.loadHistory(cn);
                        }
                    });

                    console.log("Connecting account " + slackObj.self.name);
                    slackWS = new WebSocket(slackObj.url);

                    slackWS.onopen = function(_data){
                        console.log("Successfully connected account " + slackObj.self.name);
                        console.log(_data);
                    }

                    slackWS.onmessage = function(_data){
                        console.log(_data);
                        var _d = JSON.parse(_data.data);
                        if (_d.type == "message") {
                            var d = new Date();
                            var h = d.getHours();
                            var m = d.getMinutes();
                            if (h < 10) {  h = "0" + h;  }
                            if (m < 10) {  m = "0" + m;  }
                            var _u = _all.users[_d.user] ? _all.users[_d.user] : _all.users[_d.username];
                            if (_all.users[_u]) {
                                ps.utils.appendMessage(
                                    {
                                        id: _u,
                                        name: _all.users[_u].name,
                                        prof: _all.users[_u].prof.image_32,
                                        cid: _d.channel,
                                        channel: _all.channels[_d.channel],
                                        message: _d.text,
                                        time: h + ":" + m
                                    }
                                );
                            }
                        } else if (_d.type == "presence_change" || _d.type == "manual_presence_change") {
                            var _user = _d.user ? _d.user : slackObj.self.id;
                            $("div.users-list div.user[ps-uid^='" + _user + "'] div.presence")
                                .attr("class", "presence " + _d.presence);
                        } else if (_d.type == "user_change") {
                            if (!_d.user.deleted) {
                                var _uid = _d.user.id;
                                var _un = _d.user.name;
                                _all.users[_uid] = _un;
                                $("div.users-list div.user[ps-uid^='" + _uid + "'] div.username")
                                    .text(_un);
                            } else {
                                var _uid = _d.user.id;
                                //delete _all.users[_uid];
                                $("div.users-list div.user[ps-uid^='" + _uid + "']")
                                    .remove();
                            }
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
                var _isSlackbot = obj.name == " selected" ? selected : "";
                $("div#ps-chat div.users-list").append( 
                    "<div class='user" + _isSlackbot + "' ps-uid='" + obj.id + "' ps-cid='" + obj.ims + "'>"
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
                var _c = $("div#ps-actual-chat")
                var _scroll = _c[0].scrollTop > _c[0].scrollHeight -_c.height() - 28;
                $("#ps-actual-chat").append(
                    "<div class='ps-message'>"
                    +    "<div class='ps-prof' style='background: url(" + obj.prof + ");'></div>"
                    +    "<div class='ps-meta'>"
                    +        "<div class='ps-from' ps-id='" + obj.id + "'>" + obj.name + "</div>"
                    +        "<div class='ps-time'>" + obj.time + "</div>"
                    +        "<div class='ps-channel' ps-cid='" + obj.cid + "'>" + obj.channel + "</div>"
                    +    "</div>"
                    +    "<div class='ps-text'>" + obj.message + "</div>"
                    +"</div>"
                );
                if (_scroll) {
                    $("div#ps-actual-chat")[0].scrollTop = _c[0].scrollHeight;
                }
            }
        },
        loadHistory: function(cid) {
            if (cid && cid.toString()) {
                var _l = cid.trim()[0] == "D" ? "im" : cid.trim()[0] == "C" ? "channels" : "groups";
                $.ajax({
                    type: "GET",
                    url: "https://slack.com/api/" + _l + ".history?token=" + tkn + "&channel=" + cid,
                    success: function(data) {
                        if (data.ok) {
                            for (var i = data.messages.length - 1, l = -1; i > l; i--) {
                                var _u = data.messages[i].user;
                                if (_all.users[_u]) {
                                    ps.utils.appendMessage(
                                        {
                                            id: _u,
                                            name: _all.users[_u].name,
                                            prof: _all.users[_u].prof.image_32,
                                            cid: cid,
                                            channel: _all.channels[cid],
                                            message: data.messages[i].text,
                                            time: data.messages[i].ts
                                        }
                                    );
                                } else {
                                    console.log("-=[Error @ 315]=-\n" + _ul);
                                }
                            }
                        }
                    },
                    error: function(data) {
                        console.log(data);
                    }
                });
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