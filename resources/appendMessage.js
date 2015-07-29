if (ps) {
    ps.utils.appendMessage = function(obj) {
        console.log("@ appendMessage");
        if (obj.message) {
            console.log("@ appendMessage.success");
            obj.name = !obj.name ? "" : obj.name;
            obj.message = obj.message
                        .split("<").join("&lt;")
                        .split(">").join("&gt;")
                        .split("!§").join("<")
                        .split("§!").join(">");
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
    }
} else {
    console.log("Error loading ps.appendMessage()");
}