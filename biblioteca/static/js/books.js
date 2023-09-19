function searchBook(){
    let available = $("#available-filter").val();
    let category  = $("#category-filter").val();
    let query     = $("#search").val();

    let request = "livros/search?";

    if (query != "")     request += "q=" + query     + "&";
    if (available != "") request += "a=" + available + "&";
    if (category != "")  request += "c=" + category  + "&";
    
    (async () => {
        let response = await fetch(request);
        let responseObj = await response.json();
        let books = responseObj.books;
        
        $("#books").empty();
        books.forEach(b =>{
            if(b['categories'] == null) b['category__name'] = "Sem categoria";
            
            let title       = b['title'].slice(0, 30);
            let author      = b['author'].slice(0, 30);
            let description = b['description'].slice(0, 100);
            let category    = "";
            
            b['categories'].forEach(c => {
                category += `<span class="badge bg-secondary m-1">${c}</span>`;
            });

            if(title.length == 30)        title += "...";
            if(author.length == 30)       author += "...";
            if(description.length == 100) description += "...";
            
            if(b['available']){
                available = '<span class="badge bg-success p-3 fs-7">Disponível</span>';
                transaction = `<a href="livros/borrow/${b.id}" class="borrow" data-bs-toggle="modal" data-bs-target="#borrow-modal"><svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 5H8V9H6V3H22V21H6V15H8V19H20V5Z" fill="#48E100"></path> <path d="M13.0743 16.9498L11.6601 15.5356L14.1957 13H2V11H14.1956L11.6601 8.46451L13.0743 7.05029L18.024 12L13.0743 16.9498Z" fill="#164600"></path> </g></svg></a>`;
                deleteBook = `<a href="livros/deletar/${b.id}" class="delete"><svg width="23" fill="#A40E1E" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fill-rule="evenodd"></path> </g></svg></a>`;
                //bg = 'bg-success';
            }else{
                available = '<span class="badge p-3 fs-7" style="background-color: #b3b300;">Emprestado</span>';
                transaction = `<a href="livros/devolution/${b.id}" class="devolution" data-bs-toggle="modal" data-bs-target="#devolution-modal"><svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 5H8V9H6V3H22V21H6V15H8V19H20V5Z" fill="#cdcd00"></path> <path d="M13.0743 16.9498L11.6601 15.5356L14.1957 13H2V11H14.1956L11.6601 8.46451L13.0743 7.05029L18.024 12L13.0743 16.9498Z" fill="#464600"></path> </g></svg></a>`;
                deleteBook = `<a href="#" class="delete"><svg width="23" fill="#A40E1E" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fill-rule="evenodd"></path> </g></svg></a>`;
                //bg = 'bg-danger';
            }
            
            $("#books").append(`
            <tr class="align-middle" style="--bs-bg-opacity: .16;">
                <td class="col-available">${available}</td>
                <td>${title}</td>
                <td>${author}</td>
                <td class="col-description">${description}</td>
                <td class="col-category">${category}</td>
                <td>${transaction}</td>
                <td><a href="livros/editar/${b.id}" class="edit" data-bs-toggle="modal" data-bs-target="#create-modal"><svg width="23" fill="#50470B" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" transform="rotate(90)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.974 49.076c65.267-65.379 171.733-65.49 237.448 0l232.186 232.187 1055.697 1055.809L1919.958 1920l-582.928-116.653-950.128-950.015 79.15-79.15 801.792 801.68 307.977-307.976-907.362-907.474L281.22 747.65 49.034 515.464c-65.379-65.603-65.379-172.069 0-237.448Zm1376.996 1297.96-307.977 307.976 45.117 45.116 384.999 77.023-77.023-385-45.116-45.116ZM675.355 596.258l692.304 692.304-79.149 79.15-692.304-692.305 79.149-79.15ZM396.642 111.88c-14.33 0-28.547 5.374-39.519 16.345l-228.94 228.94c-21.718 21.718-21.718 57.318 0 79.149l153.038 153.037 308.089-308.09-153.037-153.036c-10.972-10.971-25.301-16.345-39.63-16.345Z" fill-rule="evenodd"></path> </g></svg></a></td>
                <td>${deleteBook}</td>
            </tr>
            `);
        });   
        
        $(".edit").on("click", (e) => {
            let bookId = $(e.currentTarget).attr("href").split("/")[2];
            let request = "livros/info/" + bookId;

            $("#form-create").attr("class", "form-edit");
            $("#form-create").attr("action", `livros/editar/${bookId}`);
            $("#modal-title").text("Editar livro");

            
            (async () => {
                let response = await fetch(request);
                let responseObj = await response.json();
                let book = responseObj.book;

                $("#title").val(book.title);
                $("#author").val(book.author);
                $("#description").val(book.description);
                $('#category').multiSelect('deselect_all');
                $('#cover-thumb').attr("src", book.cover);
                
                book.categories.forEach(category => {
                    $('#category').multiSelect('select', category.toString());
                });
            })();
        });

        $(".delete").on("click", (e) => {
            e.preventDefault();
            let href = $(e.currentTarget).attr("href");
            
            if(href.includes("#")){
                $("#delete-lock-modal").modal("show");
            }else{
                $("#delete-modal").modal("show");
                $("#delete-confirm").attr("href", href);
            }

        });

        $(".devolution").on("click", (e) => {
            $("#devolution-confirm").attr("href", $(e.currentTarget).attr("href"));
            
            let bookId = $(e.currentTarget).attr("href").split("/")[2];
            let request = "livros/borrow/" + bookId;

            (async () => {
                let response = await fetch(request);
                let responseObj = await response.json();

                let name = responseObj.user.name;
                let borrowDate = responseObj.transaction.issued_on;
                let borrowDue = responseObj.transaction.due_date;
            
                $("#borrow-user").val(name);
                $("#borrow-date").val(borrowDate);
                $("#borrow-due").val(borrowDue);

            })();
        });

        $(".borrow").on("click", (e) => {
            let bookId = $(e.currentTarget).attr("href").split("/")[2];
            let request = "livros/info/" + bookId;
            
            (async () => {
                let response = await fetch(request);
                let responseObj = await response.json();
                let book = responseObj.book;
                
                $("#title-borrow").val(book.title).attr("disabled", true);
                $("#book-borrow").val(book.id);
            })();
        });
    })();
}

$('.ui.dropdown').dropdown();

$(document).ready( () => {
    $(".create").on("click", () => {
        $("#form-create").attr("class", "form-create");
        $("#modal-title").text("Adicionar livro");
        
        $("#title").val("");
        $("#author").val("");
        $("#description").val("");
        $('#cover-thumb').attr("src", "/static/img/book.jpg");
        $('#category').multiSelect('deselect_all');
    });

    $("#button-cover").on("click", (e) => {
        e.preventDefault();
        $("#input-cover").click();
    });

    $("#form-create").on("submit", async (e) => {
        e.preventDefault();

        if($("#form-create").attr("class") != "form-create"){
            let request = $(e.currentTarget).attr("action");
            console.log(request);
            let formData = new FormData(e.currentTarget);
            let cover = $("#cover-thumb").attr("src");
            let blob = await fetch(cover).then((response) => response.blob());

            formData.append("cover", blob, "cover.jpg");
            
            let response = await fetch(request, {
                method: "POST",
                body: formData
            });

            if(response.ok){
                $("#create-modal").modal("hide");
                searchBook();
            }
        }else{
            let request = "livros/criar";
            let formData = new FormData(e.currentTarget);
            let cover = $("#cover-thumb").attr("src");
            let blob = await fetch(cover).then((response) => response.blob());
            console.log(request);
            formData.append("cover", blob, "cover.jpg");
            
            let response = await fetch(request, {
                method: "POST",
                body: formData
            });
    
            if(response.ok){
                $("#create-modal").modal("hide");
                searchBook();
            }
        }
    });
    
    searchBook();
    $("#search").on("keyup", searchBook);
    $("#category-filter").on("change", searchBook);
    $("#available-filter").on("change", searchBook);
    $('#category').multiSelect();
    
    $("#input-cover").on('change', e => {
        var files = e.target.files;
        
        $("#cover").removeAttr("src");
        $("#cover").attr("src", URL.createObjectURL(files[0]));
        $("#cover-modal").modal('show');
        $(e.currentTarget).val("");
    });
    
    $("#cover-thumb").on("click", () => {
        $("#cover").attr("src", $("#cover-thumb").attr("src"));
        $("#cover-modal").modal('show');
    }).on("mouseenter", (e) => {
        $(e.currentTarget).css("cursor", "pointer");
    });
    
    $('#upload-cover').on("click", () => {
        $("#cover-modal").modal("show");
    });
    
    let cropper;
    $("#cover-modal").on('shown.bs.modal', () =>{
        cropper = new Cropper(cover, {
            aspectRatio: 1322/2048,
            viewMode: 1,
        });
    }).on('hidden.bs.modal', () => {
        cropper.destroy();
        cropper = null;
    });
    
    $("#confirm-crop").on("click", () => {
        let canvas = cropper.getCroppedCanvas();
        let imageUrl = canvas.toDataURL();
        $("#cover-thumb").attr("src", imageUrl);
        $("#cover-modal").modal("hide");
    });
});