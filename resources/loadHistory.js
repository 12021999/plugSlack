if (ps) {
    ps.utils.loadHistory = function(cid) {
        if (cid && cid.toString()) {
            var _l = cid.trim()[0] == "D" ? "im" : cid.trim()[0] == "C" ? "channels" : "groups";
            $.ajax({
                type: "GET",
                url: "https://slack.com/api/" + _l + ".history?token=" + tkn + "&channel=" + cid,
                success: function(data) {
                    if (data.ok) {
                        console.log("@ loadHistory.success");
                        if (data.messages.length > 0) {
                            for (var i = data.messages.length - 1, l = -1; i > l; i--) {
                                var _u = data.messages[i].user;
                                if (_all.users[_u]) {
                                    console.log("Double loadHistory success");
                                    var _p = _all.users[_u].prof.image_32 ? "image_32" : "image_48";
                                    ps.utils.appendMessage(
                                        {
                                            id: _u,
                                            name: _all.users[_u].name,
                                            prof: _all.users[_u].prof[_p],
                                            cid: cid,
                                            channel: _all.channels[cid],
                                            message: ps.utils.format(data.messages[i].text),
                                            time: ps.utils.fixTime(data.messages[i].ts)
                                        }
                                    );
                                } else {
                                    console.log("-=[Error @ 315]=- [" + _u + "]");
                                    console.log(data.messages[i]);
                                }
                            }
                        } else {
                            $("div#ps-actual-chat").append("<div class='ps-nothing-here'></div>");
                        }
                    }
                },
                error: function(data) {
                    console.log("@ loadHistory.error");
                }
            });
        }
    }
} else {
    console.log("Error loading ps.loadHistory()");
}