$(document).ready(function() {
    $(".delete").click(function(e) {
        $("#delete-confirm").attr("href", $(this).attr("href"));
    });

    $(".create").click(function(e) {
        $("#modal-title").text("Adicionar usuário");
        $("#name").val("");
        $("#phone").val("");
        $("#email").val("");
        $("#form").attr("action", "usuarios/criar");
    });
    
    $(".edit").click(function(e) {
        e.preventDefault();
        $("#edit-confirm").attr("href", $(this).attr("href"));
        var userId = $(this).attr("href").split("/")[3];
        let request = "usuarios/info/" + userId;

        (async () => {
            let response = await fetch(request);
            let responseObj = await response.json();
            let user = responseObj.user;
            
            if (user == null) location.reload();

            $("#modal-title").text("Editar usuário");
            $("#name").val(user.name);
            $("#phone").val(user.phone);
            $("#email").val(user.email);
            
            $("#form").attr("action", "usuarios/editar/" + userId);
        })();
    });

    $(".info").click(function(e) {
        e.preventDefault();
        let userId = $(this).attr("href");
        let request = "usuarios/info-transactions/" + userId;

        $("#transactions").empty();
        (async () => {
            let response = await fetch(request);
            let responseObj = await response.json();
            let transactions = responseObj.transactions;
            
            if (transactions == null) location.reload();

            transactions.forEach(transaction => {

                let status = "";
                
                if(transaction.active){
                    status = "Pendente";
                }else{
                    status = "Entregue";
                }

                let returnDate = transaction.return_date;
                
                if(transaction.return_date == null){
                    returnDate = "";
                }

                $("#transactions").append(`
                    <tr>
                        <td>${transaction.book_title}</td>
                        <td>${transaction.issued_on}</td>
                        <td>${transaction.due_date}</td>
                        <td>${returnDate}</td>
                        <td>${status}</td>
                    </tr>
                `);
            });

        })();
    });
    
    $("#phone").inputmask("(99) 999999999"); 
});