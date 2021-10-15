var pastas = ["arquivo_textos_theravada", "caminho_liberdade", "dhp", "sutta"]

$(function(){
    loadContent("layout/nav.html", "#nav-placeholder");
    loadContent("layout/footer.html", "#footer-placeholder");
    if(!getPageFromUrl())
        loadContent("inicial.html");
})

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

function loadContent(pageRelativePath, target = '#body-placeholder', profundidade = 0){
    $.ajaxSetup({
        'beforeSend' : function(xhr) {
            xhr.overrideMimeType('text/html; charset=ISO-8859-1');
        },
        cache: false
    });

    $(target).load(pageRelativePath, function( response, status, xhr ) {
        const partes = pageRelativePath.split("/");
        const arquivo = partes[partes.length-1];
        if ( status == "error" ) {
            if(profundidade > pastas.length){
                var msg = "Não foi possível carregar o arquivo: " + pageRelativePath;
                alert( msg + " " + xhr.status + " " + xhr.statusText );
            }
            else {
                const newPageRelativePath = pastas[profundidade] + "/" + arquivo;
                loadContent(newPageRelativePath, target, ++profundidade)
            }
        }
        else {
            const protocol = window.location.protocol;
            const hostname = window.location.hostname;
            const port = window.location.port;
            const pathName = window.location.pathname;
            const url = `${protocol}//${hostname}:${port}${pathName}?page=` + arquivo
            window.history.pushState("", "", url);
        }
    });
}
