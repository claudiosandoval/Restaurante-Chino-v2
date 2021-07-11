(function (global) { //usar iifi (funcion autoinvocada para envolver todo el codigo)

    var ajaxUtils = {}; //configuramos nuestro namespace con esto puedo exponer cosas al exterior
    
    function getRequestObject() {
        if (window.XMLHttpRequest) {
            return (new XMLHttpRequest()); //devuelve un objeto que luego sera almacenado en una variable
        }
        // else if (windows.ActiveXObject) {
        //     //para antiguos navegadores como internet explorer, realmente ya no se usa
        //     return (new ActiveXObject("Microsoft.XMLHTTP"));
        // }
        else {
            global.alert("Ajax no es soportado!");
            return(null);
        };
    };
    
    //Se define la funcion para el objeto llamada sendGetRequest la cual enviara una solicitud get al servidor
    ajaxUtils.sendGetRequest = 
        function (requestUrl, responseHandler, isJsonResponse) { //nececitamos saber la url y nececitamos un controlador que maneje la respuesta del servidor (responseHandler)
            var request = getRequestObject(); //guardamos en una variable el objeto que devolvera esa peticion
            request.onreadystatechange = //onreadystatechangue son diferentes estapas que ocuren entre la comunicacion del cliente y el servidor
                function() {
                    handleResponse(request, responseHandler, isJsonResponse); //se llama a la funcion handleResponse la cual nececita la solicitud y el controlador
                };
            request.open("GET", requestUrl, true); //seteamos la solicitud que vamos a enviar para este caso get (el metodo), le pasamos la url y nos aseguramos de que sea true de ser falso seria sincronica, por lo tanto se congelaria ya que estaria esperando infinitamente por lo que asincronico espera y pasa a la segunda linea en donde enviamos esa solicitud
            request.send(null); //enviamos la solicitud al servidor // la razon de porque aqui es null es debido a que si fuera post los datos se pasan por el body y estos por la url
        };
    
        function handleResponse (request, responseHandler, isJsonResponse) {
            if ((request.readyState == 4) && request.status == 200) { //comprobamos que estemos en la ultima etapa de la comunicacion y asegugarnos de que no dio error osea estado 200
            
                //configuracion JSON
                if(isJsonResponse == undefined) {
                    isJsonResponse = true; //pasa la condicion y sigue
                };

                if(isJsonResponse) {
                    responseHandler(JSON.parse(request.responseText)) //de esta manera transformamos esa respuesta en un objeto json
                }
                else {
                    responseHandler(request.responseText); //luego de que se cumpla la condicion responseHandler puede tomar la respuesta del servidor (la retorna)
                };
            };
        };
    
        global.$ajaxUtils = ajaxUtils; //exponemos esta utilidad a el objeto global para que podamos usarla
    
    
})(window); //se pasa como parametro window que es nuestro objeto global