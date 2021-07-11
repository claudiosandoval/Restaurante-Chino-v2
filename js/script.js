// (function() {
//     document.querySelector(".navbar-toggler").addEventListener("blur", function() {
//         //comparativa jquery $(".navbar-toggler").blur(function(){})
//         var screenWidth = window.innerWidth;
//         if(screenWidth < 992) { 
//             var listaDespliegue = document.getElementById("navbarNavAltMarkup");
//             listaDespliegue.classList.remove("show");
//         }
//     })
// })();

// document.addEventListener("DOMContentLoaded", function() {
//     alert("hola mundo");
// });



$(document).ready(function(){ 
    $(".navbar-toggler").blur(function(){ //la lista de despliegue se cierra al quitar el foco del boton de despliegue
        var screenWidth = window.innerWidth;
        if(screenWidth < 992) {
            $('.collapse').collapse("hide");
        }
    })
});

(function (global) {

    rs = {}; //Restaurant

    var homeHtml = "snippets/home-snippet.html"

    var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json"; //recoge del servidor alojado en herokuapp todas las categorias del menu
    var categoriesTitleHtml = "snippets/categories-title-snippet.html"; //guardamos en una variable el html del titulo del menu de categorias para luego incrustarlo y crear nuestra SPA
    var categoryHtml = "snippets/category-snippet.html"; //guardamos el html (template) de las categorias
    var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippets/items-menu-title-snippet.html";
    var menuItemsHtml = "snippets/menu-item-snippet.html"


    var insertHTML = function(selector, html) { //funcion que carga el html para no repetir cada vez que nececitemos insertar html
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    //LOADER 
    var loading = function(selector) {
        var html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>"; 
        insertHTML(selector, html);
    }

    //Funcion que sustituye las propiedades {{ propName }} con el valor real en el string (html) 
    //el cual recibe el string(html) propName(nombre de la propiedad) y propValue(el valor de la propiedad)
    //fuente https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/replace
    var insertProperty = function(string, propName, propValue) {
        var propToReplace = "{{ " + propName + " }}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue); //en esta linea remplaza globalmente "g" todas las coincidencias del nombre de la propiedad por el valor real no solo la coincidencia real.. existen muchas bibliotecas que hacen esto muy bien pero en este proyecto solo utilizaremos codigo puro para realizar este remplazo a modo de aprendizaje.
        return string; //devuelve la cadena con los valores reales de la propiedad
    }

    var switchMenuToActive = function() {
        //quitar la clase active al boton home que esta predeterminado en active
            var classes = document.querySelector("#navHomeButton").className;
            classes = classes.replace(new RegExp("active", "g"), "");
            console.log(classes);
            document.querySelector("#navHomeButton").classList = classes;

        //añadir la clase active al boton si no esta allí
        var classes = document.querySelector("#navMenuButton").className;
        if(classes.indexOf("active") == -1) {
            classes += " active";
            document.querySelector("#navMenuButton").className = classes;
        }
    };

    document.addEventListener("DOMContentLoaded", function(event) {
        //se inicia el loader antes si demora en traer la data 
        loading("#main-content");
        $ajaxUtils.sendGetRequest(homeHtml, 
            function(responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false); //pasamos falso ya que no estamos procesando un archivo JSON solo es texto plano html  
        });

        //Cargar todas las categorias del menu
        rs.loadMenuCategories = function() {
            loading("#main-content");
            $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHtml); //la razon por la que no pasamos el tercer parametro como "true" es debido a que ya esta predeterminado como true
        }

        //Cargar los items especificos de cada menu 
        rs.loadMenuItems = function(categoryShort) { //categoryShort es el short_name de la categoria que es devuelto en category-snippet
            loading("#main-content");
            $ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort, buildAndShowMenuItemsHtml); //ej: https://davids-restaurant.herokuapp.com/menu_items.json?category= + VG por ejemplo vegetables
        }
        
        //Construye y trae la data para el HTML de la pagina de categorias
        function buildAndShowCategoriesHtml(categories) {
            //llamada ajax para cargar el titulo del menu
            $ajaxUtils.sendGetRequest(categoriesTitleHtml,
                function(categoriesTitleHtml) {
                    //recuperamos el html de las categorias
                    $ajaxUtils.sendGetRequest(categoryHtml, //relizamos una solicitud ajax dentro de la otra ya que la logica seria primero tener el titulo para luego traer el html de las categorias
                        function(categoryHtml) {

                            switchMenuToActive();

                            var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
                            insertHTML("#main-content", categoriesViewHtml);
                            
                        },false); //pasamos falso debido a que no queremos que este string lo convierta a json solo lo queremos en texto plano
                },false);
        }

        //funcion que usa la data y los snippets para insertar la vista en la pagina
        function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
            var finalHtml = categoriesTitleHtml;
            finalHtml += "<section class='row mt-5'>";
            //loop para insertar las categorias 
            for(var i = 0; i < categories.length; i++) {
                //insertar los valores de categorias
                var html = categoryHtml;
                //console.log(html);
                var name = categories[i].name;
                //console.log(name);
                var short_name = categories[i].short_name;
                //console.log(short_name);
                html = insertProperty(html, "name", name);
                html = insertProperty(html, "short_name", short_name);
                finalHtml += html;
            }

            finalHtml += "</section>";
            
            return finalHtml;
        }  

        function buildAndShowMenuItemsHtml(categoryMenuItems) {
            console.log(categoryMenuItems);
            //llamada ajax para cargar el titulo de los items del menu
            $ajaxUtils.sendGetRequest(menuItemsTitleHtml,
                function(menuItemsTitleHtml) {
                    //recuperamos el html de los items del menu
                    $ajaxUtils.sendGetRequest(menuItemsHtml,
                        function(menuItemsHtml) {

                            switchMenuToActive();

                            var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemsHtml);
                            insertHTML("#main-content", menuItemsViewHtml);
                        },false);
                },false);
        }

        function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemsHtml) {
            menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
            menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);

            var finalHtml = menuItemsTitleHtml;
            finalHtml += "<section class='row'>";

            var menuItems = categoryMenuItems.menu_items;
            var catShortName = categoryMenuItems.category.short_name;

            //recorremos todos los items segun tu categoria
            for (var i = 0; i < menuItems.length; i++) {
                var html = menuItemsHtml;   
                html = insertProperty(html, "short_name", menuItems[i].short_name);
                html = insertProperty(html, "catShortName", catShortName);
                html = insertItemPrice(html, "price_large", menuItems[i].price_large);   
                html = insertProperty(html, 'name', menuItems[i].name);
                html = insertProperty(html, 'description', menuItems[i].description);


                if(i % 2 != 0) {
                    html += "<div class='clearfix d-none d-md-block d-lg-block'></div>";
                }

                finalHtml += html;
                //console.log(finalHtml);
            }  
            
            
            finalHtml += "</section>";
            return finalHtml;
        }
        
        function insertItemPrice(html, pricePropName, priceValue) {
            if(!priceValue) {
                return insertProperty(html, pricePropName, "");
            }

            priceValue = "$" + priceValue.toFixed(2); //tofixed https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
            html = insertProperty(html, pricePropName, priceValue);
            return html;
        }

        





    global.$rs = rs;

})(window);