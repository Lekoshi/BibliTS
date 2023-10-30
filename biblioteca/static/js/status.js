$(document).ready(function() {
    let request = "status/info";

    (async () => {
        let response = await fetch(request);
        let responseObj = await response.json();

        let booksCount = responseObj.books.length;
        let usersCount = responseObj.users.length;
        let transactionsCount = responseObj.transactions.length;
        let transactionsActiveCount = responseObj.activeTransactions.length;
        let transactionsPerMonth = responseObj.transactionsPerMonth;
        let overdues = responseObj.overdues;
        let warnings = responseObj.warnings;
        let currentMonth = responseObj.currentMonth;

        $("#books-count").text(booksCount);
        $("#users-count").text(usersCount);
        $("#transactions-count").text(transactionsActiveCount);
        
        overdues.forEach(overdue => {
            if(overdue.days_late > 1){
                overdue.days_late += " dias";
            } else {
                overdue.days_late += " dia";
            }

            $("#overdues").append(`
                <tr>
                    <td>${overdue.user__name}</td>
                    <td>${overdue.book_title}</td>
                    <td>${overdue.due_date}</td>
                    <td>${overdue.days_late}</td>
                </tr>
            `);
        });

        warnings.forEach(warning => {
            $("#warnings").append(`
                <tr>
                    <td>${warning.user__name}</td>
                    <td>${warning.book_title}</td>
                    <td>${warning.due_date}</td>
                </tr>
            `);
        });

        new Chart($("#chart1"), {
            type: "line",
            data: {
                labels: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
                datasets: [{
                    label: "Empréstimos por mês",
                    data: transactionsPerMonth,
                    borderColor: "#1a3bbf",
                    fill: true,
                    borderWidth: 4,
                }]
                
            },
        })

        let transactionsPerYear = transactionsPerMonth.reduce((a, b) => a + b, 0);

        new Chart($("#chart2"), {
            type: "bar",
            data: {
                labels: ["Emprestimos totais", "Empréstimos anuais", "Empréstimos mensais"],
                datasets: [{
                    label: "Empréstimos",
                    data: [transactionsCount, transactionsPerYear, transactionsPerMonth[currentMonth - 1]],
                    borderColor: "#16aca2",
                    fill: true,
                    borderWidth: 4,
                }]
                
            },
        })
        
    })();

});