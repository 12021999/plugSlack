if (ps) {
    ps.utils.appendItem = function(obj) {
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
    }
} else {
    console.log("Error loading ps.appendItem()");
}