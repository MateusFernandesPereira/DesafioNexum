document.addEventListener("DOMContentLoaded", function () {
    var dataList = document.getElementById("data-list");
    var pagination = document.getElementById("pagination");
    var dados = [];
    var currentPage = 1;
    var recordsPerPage = 5;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/usuarios", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            dados = JSON.parse(xhr.responseText);
            displayList(dados, dataList, recordsPerPage, currentPage);
            setupPagination(dados, pagination, recordsPerPage);
        }
    };
    xhr.send();

    var inputName = document.getElementById("searchName");
    var inputCpfCnpj = document.getElementById("searchCpfCnpj");

    inputName.addEventListener("input", function () {
        filterTable(inputName.value.toUpperCase(), 'name_completo');
    });

    inputCpfCnpj.addEventListener("input", function () {
        filterTable(inputCpfCnpj.value.toUpperCase(), 'cpfcnpj');
    });

    function displayList(items, wrapper, rowsPerPage, page) {
        wrapper.innerHTML = "";
        page--;

        var start = rowsPerPage * page;
        var end = start + rowsPerPage;
        var paginatedItems = items.slice(start, end);

        for (var i = 0; i < paginatedItems.length; i++) {
            var dado = paginatedItems[i];
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
                <td>
                    <div style="display: flex; flex-direction: row">
                        <button type="button" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#modalEdicao">
                        <i class="bi bi-pencil"></i></button>
                        <button type="button" data-id="${dado.id}" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalDelecao">
                        <i class="bi bi-trash"></i></button>
                    </div>
                </td>
            `;

            row.addEventListener("click", function (event) {
                var id = parseInt(this.cells[0].textContent); // Aqui estamos pegando o valor do ID da primeira célula da linha clicada
                console.log("ID do usuário:", id);
                // Aqui estamos fazendo a conexão do delete do endpoint assim que acionar o botão de confirmação do modal
                document.querySelector('#modalDelecao .btn-danger').addEventListener('click', function () {
                    fetch(`http://localhost:8080/usuarios/${id}`, {
                        method: 'DELETE'
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Erro ao excluir o usuário');
                            }
                            console.log('Usuário excluído com sucesso');
                            alert("Usuário excluído com sucesso")
                            location.reload()
                            // Faça o que for necessário após excluir o usuário com sucesso
                        })
                        .catch(error => {
                            console.error('Erro:', error);
                            // Trate o erro conforme necessário
                        });
                });

                /*
                document.querySelector('#modalDelecao .btn-danger').addEventListener('click', function () {
                    fetch(`http://localhost:8080/usuarios/${id}`, {
                        method: 'DELETE'
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Erro ao excluir o usuário');
                            }
                            console.log('Usuário excluído com sucesso');
                            alert("Usuário excluído com sucesso")
                            location.reload()
                            // Faça o que for necessário após excluir o usuário com sucesso
                        })
                        .catch(error => {
                            console.error('Erro:', error);
                            // Trate o erro conforme necessário
                        });  
                });
                */
            });
            dataList.appendChild(row);
        }
    }

    // Adiciona ouvinte de evento ao botão de exclusão dentro do modal









    function setupPagination(items, wrapper, rowsPerPage) {
        wrapper.innerHTML = "";

        var pageCount = Math.ceil(items.length / rowsPerPage);

        for (var i = 1; i <= pageCount; i++) {
            var btn = paginationButton(i, items);
            wrapper.appendChild(btn);
        }
    }

    function paginationButton(page, items) {
        var button = document.createElement("li");
        button.classList.add("page-item");
        var link = document.createElement("a");
        link.classList.add("page-link");
        link.innerText = page;

        link.addEventListener("click", function () {
            currentPage = page;
            displayList(items, dataList, recordsPerPage, currentPage);
        });

        button.appendChild(link);
        return button;
    }

    function filterTable(filter, column) {
        var filteredData = dados.filter(function (item) {
            var value = item[column].toUpperCase();
            return value.includes(filter);
        });

        currentPage = 1; // Define a página atual como 1 após a pesquisa

        displayList(filteredData, dataList, recordsPerPage, currentPage);
        setupPagination(filteredData, pagination, recordsPerPage);
    }
});