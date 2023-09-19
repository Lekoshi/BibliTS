function searchBook(){
    let available = $("#available-filter").val();
    let category  = $("#category-filter").val();
    let query     = $("#search").val();

    let request = "livros/search?";

    if (query != "")     request += "q=" + query     + "&";
    if (available != "") request += "a=" + available + "&";
    if (category != "")  request += "c=" + category  + "&";

    //let request   = 'livros/search/a=' + available + "?c=" + category + "?q=" + query;
    
    (async () => {
        let response = await fetch(request);
        let responseObj = await response.json();
        let books = responseObj.books;

        if($("#books-view").is(':checked')){
            $('#books-display').slick('unslick');
            $("#books-display").empty();

            books.forEach(b =>{
                if(b['categories'] == null) b['category__name'] = "Sem categoria";
                
                let title       = b['title'].slice(0, 40);
                let author      = b['author'].slice(0, 40);
                let description = b['description'].slice(0, 450);
                let cover       = b['cover'];
            
                if(cover == null){
                    cover = "/static/img/book.jpg";
                }else{
                    cover = "/media/" + cover;
                }

                if(title.length == 40)        title += "...";
                if(author.length == 40)       author += "...";
                if(description.length == 450) description += "...";
                
                if(b['available']){
                    available = '<span class="badge bg-success">Disponível</span>';
                }else{
                    available = '<span class="badge" style="background-color: #b3b300;">Emprestado</span>';
                }
                
                $("#books-display").append(`
                    <div class="image-div mx-5 text-center" style="width: 240px; background-image: URL(${cover})">
                        <div class="card" style="height: 100%; background-color: rgba(0,0,0,0.8); color: white">
                            <div class="card-header border-0">
                                ${title}
                            </div>
                            <div class="card-body border-0" style="text-align: justify; font-size: 0.8em">
                                ${description}
                            </div>
                            <div class="card-footer border-0">
                                ${author}<br>
                                ${available}
                            </div>
                        </div>
                    </div>
                `);
                
                $("")

            });    
            $('#books-display').slick({
                slidesToScroll: 1,
                infinite: true,
                variableWidth: true,
                centerMode: true,
            }); 
        }else{
            $("#books-display").empty();
            $("#books-display").append(`
                <table class="table table-hover text-center">
                    <thead style="background-color: #3d3025; color: white">
                        <tr>
                            <th scope="col" class="col-available"></th>
                            <th scope="col" style="width: 15%;">Título</th>
                            <th scope="col" style="width: 13%;">Autor</th>
                            <th scope="col" class="col-description">Descrição</th>
                            <th scope="col" style="width: 17%;">Categorias</th>
                        </tr>
                    </thead>
                    <tbody id="books" class="">
                    </tbody>
                </table>
            `);
            $("#books").empty();
            books.forEach(b =>{
                if(b['categories'] == null) b['category__name'] = "Sem categoria";
                
                let title       = b['title'].slice(0, 30);
                let author      = b['author'].slice(0, 30);
                let description = b['description'].slice(0, 80);
                let category    = "";
                
                b['categories'].forEach(c => {
                    category += `<span class="badge bg-secondary m-1">${c}</span>`;
                });

                if(title.length == 30)        title += "...";
                if(author.length == 30)       author += "...";
                if(description.length == 80) description += "...";
                
                let availableClass = "";
                if(b['available']){
                    available = '<span class="badge bg-success p-3 fs-6">Disponível</span>';
                    availableClass = "row-available";
                }else{
                    available = '<span class="badge p-3 fs-6" style="background-color: #b3b300;">Emprestado</span>';
                    availableClass = "row-borrowed";
                }
                
                $("#books").append(`
                    <tr class="align-middle ${availableClass}" style="--bs-bg-opacity: .16;">
                        <td class="col-available">${available}</td>
                        <td>${title}</td>
                        <td>${author}</td>
                        <td class="col-description">${description}</td>
                        <td>${category}</td>
                    </tr>
                `);
            });   
        }
    })();
}

$(document).ready(function() {
    $('#books-display').slick();
    searchBook();
    $("#search").on("keyup", searchBook);
    $("#category-filter").on("change", searchBook);
    $("#available-filter").on("change", searchBook);
    $("#books-view").on("change", searchBook);
});