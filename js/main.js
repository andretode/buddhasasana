var cache = [];

$(function () {
    loadCache();
    loadContent("layout/nav.html", "#nav-placeholder");
    loadContent("layout/footer.html", "#footer-placeholder");
    if (!getPageFromUrl())
        loadContent("inicial.html");
})

function getPageFromUrl() {
    const parametros = window.location.search;
    if (parametros === null || parametros === "")
        return false;

    const partes = parametros.split('=');
    if (partes.length !== 2)
        return false;

    const page = partes[1]
    loadContent(page);
    return true
}

function loadContent(pageRelativePath, target = '#body-placeholder') {
    $.ajaxSetup({
        'beforeSend': function (xhr) {
            xhr.overrideMimeType('text/html; charset=ISO-8859-1');
        },
        cache: false
    });

    const pageFromCache = getPathFromCache(pageRelativePath);
    loadContenteHandler(pageFromCache, target);
}

function getPathFromCache(pageRelativePath) {
    const filename = getFilenameFromPath(pageRelativePath);
    const dir = cache[filename];
    if (dir === undefined) {
        console.warn(`Arquivo ${filename} nao foi encontrado no cache!`)
        return pageRelativePath;
    }
    return dir ? `${dir}/${filename}` : filename;
}

function loadContenteHandler(pageRelativePath, target) {
    $(target).load(pageRelativePath, function (resp, status, xhr) {
        const filename = getFilenameFromPath(pageRelativePath);
        if (status == "error") {
            var msg = "Não foi possível carregar o arquivo: " + pageRelativePath;
            alert(msg + " " + xhr.status + " " + xhr.statusText);
        }
        else {
            addFilenameToUrl(filename);
        }
    });
}

function addFilenameToUrl(filename) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    const pathName = window.location.pathname;
    const url = `${protocol}//${hostname}:${port}${pathName}?page=` + filename
    window.history.pushState("", "", url);
}

function getFilenameFromPath(pageRelativePath) {
    const partes = pageRelativePath.split("/");
    return partes[partes.length - 1];
}

function loadCache() {
    $.ajax({
        url: "_getcache.php",
        success: function (resp) {
            cache = resp
        },
        error(xhr) {
            console.error(xhr.responseText)
        }
    });
}

// Script para inserir os créditos ao Michael Beisert
$(function () {
    const translationCreditsElement = document.querySelector("#translation-credits");
    let p = document.createElement("p");
    p.textContent = "Tradução por Michael Beisert.";
    translationCreditsElement.appendChild(p);
})
