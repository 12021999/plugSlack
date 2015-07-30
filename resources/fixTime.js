if (ps) {
    ps.utils.fixTime = function(secs) {
        var t = (new Date(1970, 0, 1));
        t.setSeconds(secs);
        /*var m = t.getMinutes() + t.getTimezoneOffset();
        var h = t.getHours();
        while (m >= 60) {
            m = m - 60;
            h++;
        }
        if (h > 23) {  h = h - 24;   }
        if (h < 10) {  h = "0" + h;  }
        if (m < 10) {  m = "0" + m;  }
        return h + ":" + m;*/
        return t.getHours() + ":" + t.getMinutes();
    }
} else {
    console.log("Error loading ps.fixTime()");
}