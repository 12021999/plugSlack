if (ps) {
    ps.start = function() {
        tkn = $("input#ps-token").val().trim();
        if (tkn) {
            $.ajax({
                type: "GET",
                url: "https://slack.com/api/rtm.start?token=" + tkn,
                success: function(data) {
                    $("div.ps-start").remove();
                    slackObj = data;
                    for (var i = 0, l = slackObj.users.length; i < l; i++) {
                        if (!slackObj.users[i].deleted) {
                            for (var j = 0, k = slackObj.ims.length; j < k; j++) {
                                if (slackObj.users[i].id == slackObj.ims[j].user) {
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
                                    _all.channels[slackObj.ims[j].id] = slackObj.users[i].name;
                                    break;
                                } else if (slackObj.users[i].name == slackObj.self.name) {
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
                    for (var i = 0, l = slackObj.bots.length; i < l; i++) {
                        if (!slackObj.bots[i].deleted) {
                            _all.users[slackObj.bots[i].id] = {
                                name: slackObj.bots[i].name,
                                prof: slackObj.bots[i].icons
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

                    $("div#ps-chat div.channels-list div.channel, "
                    + "div#ps-chat div.users-list div.user, "
                    + "div#ps-chat div.groups-list div.group").on("click", function() {
                        if (!$(this).hasClass("selected")) {
                            $("div.channel.selected, "
                            + "div.user.selected, "
                            + "div.group.selected").removeClass("selected");
                            $("div.ps-message").remove();
                            $("div.ps-nothing-here").remove();
                            $(this).addClass("selected").removeClass("new");
                            cn = $(this).attr("ps-cid");
                            ps.utils.loadHistory(cn);
                        }
                    });

                    slackWS = new WebSocket(slackObj.url);

                    slackWS.onopen = function(_data){
                        console.log("Connected " + slackObj.self.name);
                    }

                    slackWS.onmessage = function(_data){
                        _data = JSON.parse(_data.data);
                        console.log("@ onmessage");
                        console.log(_data);
                        if (_data
                         && _data.type == "message") {
                            var current = {
                                user: "",
                                channel: ""
                            };
                            if (_data.user) {
                                console.log(_all.users[_data.user].name);
                                current.user = _all.users[_data.user].name;
                            }
                            if (_data.channel) {
                                console.log(" @ " + _all.channels[_data.channel]);
                                current.channel = _all.channels[_data.channel];
                            }
                            if (_data.channel == $("div.channel.selected").attr("ps-cid")) {
                                var _p = _all.users[_data.user].prof;
                                if (_p.image_32) {  _p = _p.image_32;  } else {  _p = _p.image_48;  }
                                ps.utils.appendMessage(
                                    {
                                        message: ps.utils.format(_data.text),
                                        name: current.user,
                                        id: _data.user,
                                        prof: _p,
                                        channel: current.channel,
                                        cid: _data.channel,
                                        time: ps.utils.fixTime(_data.ts)
                                    }
                                );
                            } else if (_data.channel) {
                                var _cid = _data.channel;
                                var _l = _cid.trim()[0] == "D" ? "user" : _cid.trim()[0] == "C" ? "channel" : "group";
                                var _e = ["div." + _l + "[ps-cid^='" + _cid + "']", "div#ps-" + _l + "s-button.ps-btn"];
                                if (!$(_e[0]).hasClass("selected")) {  $(_e[0]).addClass("new");  }
                                if (!$(_e[1]).hasClass("selected")) {  $(_e[1]).addClass("new");  }
                            }
                        }
                    }

                    slackWS.onerror = function(_data) {
                        console.log("@ onerror");
                    }
                },
                error: function(data) {
                    console.log("Error authenticating");
                    console.log(data);
                }
            });
        } else {
            console.log("Token not inserted");
        }
    }
} else {
    console.log("Error loading ps.start()");
}