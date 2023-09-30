$(document).ready(function() {
    let currentDate = new Date();
    $("#end-date").val(currentDate.toISOString().split("T")[0]);
    
    $("#generate-form").on("submit", (e) =>{
        e.preventDefault();
        let request = "emprestimos/relatorio?";

        let startDate = $("#start-date").val();
        let endDate   = $("#end-date").val();
        let available = $("#available").val();

        request += "s=" + startDate + "&";
        request += "e=" + endDate + "&";
        request += "a=" + available;

        console.log(request);

        (async () => {
            let response = await fetch(request);
            let responseObj = await response.json();
            
            let transactions = responseObj.transactions;
            let downloadLink = responseObj.downloadLink;

            $("#report-transations").empty();
            $("#report-download").attr("href", downloadLink);

            transactions.forEach(transaction => {
                let status = "";
                
                if(transaction.active){
                    status = "Pendente";
                }else{
                    status = "Entregue";
                }

                $("#report-transations").append(`
                    <tr>
                        <td>${transaction.user__name}</td>
                        <td>${transaction.book_title}</td>
                        <td>${transaction.issued_on}</td>
                        <td>${transaction.due_date}</td>
                        <td>${status}</td>
                    </tr>
                `);  
            });

        })();

        $("#generate-modal").modal("hide");
        $("#report-modal").modal("show");
    });
});