export default function textParser(textArray, indent) {
    var c = new Object();
    var log = [];
    var b = textArray;
    for (var i = 0; i < b.length; i++) {
        var d = b[i];
        var log_index = 0;
        var parent = c;
        while (d[0] === indent) {
            d = d.slice(1);
            parent = parent[log[log_index]];
            if (typeof parent === "undefined") {
                debugger;
            }
            log_index++;
        }
        if (d[0] === "_") {
            parent["comment"] = d.slice(1);
        } else {
            if (!("comment" in parent)) {
                parent["comment"] = "";
            }
            while (typeof parent[d] !== "undefined") {
                console.info("目次の重複を検出（上書きを回避しました）：" + d);
                d += " ";
            }
            parent[d] = new Object();
            log[log_index] = d;
        }
    }
    return c;
}
