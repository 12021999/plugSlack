if (ps) {
    ps.utils.format = function(message) {
        var _final = message;
        var _formats = [
            {c: "*", r: "b"},
            {c: "_", r: "em"},
            {c: "```", r: "pre class='ps-pre-big'"},
            {c: "`", r: "pre class='ps-pre-small'"}
        ];
        for (var _i = 0; _i < _final.length; _i++) {
            for (var i = 0, l = _formats.length; i < l; i++) {
                if (_final.indexOf(_formats[i].c) != -1) {
                    var _message = _final.replace(_formats[i].c, "!§" + _formats[i].r + "§!");
                    if (_message.indexOf(_formats[i].c) != -1) {
                        _message = _message.replace(_formats[i].c, "!§/" + _formats[i].r + "§!");
                        _final = _message;
                    }
                }
            }/*
            if (_final.indexOf("<http") != -1) {
                var _in = _final.indexOf("<http");
                _message = _final.replace("<http", "!§a href='http");
                if (_message.indexOf(">") > _final.indexOf("<http")) {
                    var _a = _final.substr(_in + 1, _final.indexOf(">") - 1);
                    _message = _message.replace(">", "' target='_blank' class='ps-link'§!" + _a + "!§/a§!");
                    _final = _message;
                }
            }*/
        }
        return _final;
    }
} else {
    console.log("Error loading ps.format()");
}