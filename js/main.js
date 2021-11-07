var cache = [];

//Ações executadas quando a página estiver pronta
$(function(){
    loadCache(carregarSiteCallback);
})

function carregarSiteCallback(){
    loadContent("layout/nav.html", "#nav-placeholder");
    loadContent("layout/footer.html", "#footer-placeholder");
    if(!getPageFromUrl())
        loadContent("inicial.html");
    insertBeisertCredits();
    handleMenuMobileClose();
}

function handleMenuMobileClose(){
    //Usei setTimeout para aguardar o menu estar totalmente renderizado
    setTimeout(() => {
        $('.navbar-collapse a:not(.dropdown-toggle)').click(function (e) {
            $('.navbar-collapse').collapse('hide');
        })
    }, 200)
}

function getPageFromUrl(){
    const parametros = window.location.search;
    if(parametros === null || parametros === "")
        return false;

    const partes = parametros.split('=');
    if(partes.length !== 2)
        return false;

    const page = partes[1]
    loadContent(page);
    return true
}

function loadContent(pageRelativePath, target = '#body-placeholder', isBack = false){
    $.ajaxSetup({
        'beforeSend' : function(xhr) {
            xhr.overrideMimeType('text/html; charset=ISO-8859-1');
        },
        cache: false
    });

    const pageFromCache = getPathFromCache(pageRelativePath);
    loadContenteHandler(pageFromCache, target, isBack);
}

function getPathFromCache(pageRelativePath){
    const filename = getFilenameFromPath(pageRelativePath);
    const dir = cache[filename];
    if(dir === undefined){
        console.warn(`Arquivo ${filename} nao foi encontrado no cache!`)
        return pageRelativePath;
    }    
    return dir ? `${dir}/${filename}` : filename;
}

function loadContenteHandler(pageRelativePath, target, isBack){
    $(".loader").show();
    $(target).load(pageRelativePath, function(resp, status, xhr) {
        const filename = getFilenameFromPath(pageRelativePath);
        if ( status == "error" ) {
            var msg = "Não foi possível carregar o arquivo: " + pageRelativePath;
            alert( msg + " " + xhr.status + " " + xhr.statusText );
        }
        else {
            if(!isBack)
                addFilenameToUrl(filename);
        }
        $(".loader").hide();
    });
}

function addFilenameToUrl(filename){
    if(isBaseFileToExclude(filename)) return

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    const pathName = window.location.pathname;
    const url = `${protocol}//${hostname}:${port}${pathName}?page=` + filename;
    const state = { page: filename}
    window.history.pushState(state, filename, url);
}

isBaseFileToExclude = filename => filename === "footer.html" || filename === "nav.html"

function getFilenameFromPath(pageRelativePath){
    const partes = pageRelativePath.split("/");
    return partes[partes.length-1];
}

function loadCache(callbackToFollow){
    $.ajax({
        url: "_getcache.php", 
        success: function(resp){
            cache = resp
            callbackToFollow();
        },
        error(xhr){
            console.error(xhr.responseText)
        }
    });
}

function insertBeisertCredits() {
    const translationCreditsElement = document.querySelector("#translation-credits");
    let p = document.createElement("p");
    p.textContent = "Tradução por Michael Beisert.";
    translationCreditsElement.appendChild(p);
}

function loadContentOnBackForwardHistory(){
    if (history.state && history.state.page)
    loadContent(history.state.page, '#body-placeholder', true)
}

$(window).on("popstate", loadContentOnBackForwardHistory);