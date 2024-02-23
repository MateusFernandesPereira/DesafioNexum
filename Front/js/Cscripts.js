document.addEventListener("DOMContentLoaded", function() {
    var dataList = document.getElementById("data-list");

    // Fazendo a solicitação AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/usuarios", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var dados = JSON.parse(xhr.responseText);

            // Processando e exibindo os dados na tabela
            dados.forEach(function(dado) {
                var row = document.createElement("tr");
                row.innerHTML = `
                    <td>${dado.id}</td>
                    <td>${dado.name_completo}</td>
                    <td>${dado.email}</td>
                    <td>${dado.tipo_pessoa}</td>
                    <td>${dado.cpfcnpj}</td>
                    <td>${dado.cep}</td>
                    <td>${dado.endereco}</td>
                    <td>${dado.bairro}</td>
                    <td>${dado.cidade}</td>
                    <td>${dado.estado}</td>
                    <td>${dado.numero}</td>
                `;
                dataList.appendChild(row);
            });

            // Adicionando a funcionalidade de pesquisa por nome
            var inputName = document.getElementById("searchName");
            inputName.addEventListener("input", function() {
                filterTable(inputName.value.toUpperCase(), 1); // 1 indica a coluna do nome completo
            });

            // Adicionando a funcionalidade de pesquisa por CPF/CNPJ
            var inputCpfCnpj = document.getElementById("searchCpfCnpj");
            inputCpfCnpj.addEventListener("input", function() {
                filterTable(inputCpfCnpj.value.toUpperCase(), 4); // 4 indica a coluna do CPF/CNPJ
            });

            // Função para filtrar os resultados da tabela
            function filterTable(filter, column) {
                var rows = dataList.getElementsByTagName("tr");
                for (var i = 0; i < rows.length; i++) {
                    var td = rows[i].getElementsByTagName("td")[column];
                    if (td) {
                        var textValue = td.textContent || td.innerText;
                        if (textValue.toUpperCase().indexOf(filter) > -1) {
                            rows[i].style.display = "";
                        } else {
                            rows[i].style.display = "none";
                        }
                    }       
                }
            }
        }
    };
    xhr.send();
});