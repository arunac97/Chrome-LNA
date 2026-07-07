document.addEventListener("DOMContentLoaded", function () {
    var status = document.getElementById("status");
    var target = document.getElementById("target");
    var button = document.getElementById("testBtn");

    var params = new URLSearchParams(window.location.search);
    var host = params.get("host") || "127.0.0.1";
    var port = params.get("port") || "5500";
    var path = params.get("path") || "/attentiondata.json";

    if (!path.startsWith("/")) {
        path = "/" + path;
    }

    var url = "http://" + host + ":" + port + path;

    if (target) {
        target.textContent = "Target: " + url;
    }

    if (status) {
        status.textContent = "Ready. Click 'Run LNA Request'.";
    }

    function setStatus(text, isOk) {
        if (!status) {
            return;
        }

        status.textContent = text;
        status.classList.remove("ok");
        status.classList.remove("error");
        status.classList.add(isOk ? "ok" : "error");
    }

    async function testLocalNetworkAccess() {
        setStatus("Running request to " + url + " ...", true);

        try {
            var response = await fetch(url, {
                method: "GET",
                mode: "cors",
                cache: "no-store"
            });

            if (!response.ok) {
                setStatus("Request reached target but returned HTTP " + response.status + ".", false);
                return;
            }

            setStatus("Success. LNA/CORS request completed with HTTP " + response.status + ".", true);
        } catch (error) {
            setStatus("Blocked or failed: " + error.message + ". Check Chrome LNA permission, CORS, and server headers.", false);
        }
    }

    if (button) {
        button.addEventListener("click", testLocalNetworkAccess);
    }
});
