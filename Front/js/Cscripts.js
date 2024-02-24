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
                    <div style="display: flex; flex-direction: row; margin-left: 5px">
                        <button onclick="coletarId()" id="${dado.id}" type="button" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#modalEdicao">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button id="${dado.id}" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalDelecao" data-user-id="${dado.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            dataList.appendChild(row);
        }
    }

    // Adiciona ouvinte de evento ao botão de exclusão
    document.querySelectorAll('.btn-danger').forEach(button => {
        button.addEventListener('click', function () {
            var userId = parseInt(this.getAttribute('data-user-id')); // Obtém o ID do usuário do atributo data
            coletarId2(userId); // Chama a função coletarId2 com o ID do usuário como argumento
        });
    });

    // Adiciona ouvinte de evento ao botão de confirmação de exclusão
    document.querySelector('#modalDelecao .btn-danger').addEventListener('click', function () {
        deletarTrueUsuario(); // Chama a função deletarTrueUsuario quando o botão for clicado
    });

    function coletarId2(id) {
        document.getElementById("modalDelecao").dataset.userId = parseInt(id, 10); // Convertendo o ID para inteiro
    }

    function deletarTrueUsuario() {
        var id = parseInt(document.getElementById("modalDelecao").dataset.userId); // Convertendo o ID para inteiro

        fetch(`http://localhost:8080/usuarios/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir o usuário');
                }
                return response.json();
            })
            .then(data => {
                console.log('Usuário excluído com sucesso:', data);
                alert("Usuário excluído com sucesso!");
                location.reload(); // Recarrega a página para atualizar a lista de dados
            })
            .catch(error => {
                console.error('Erro:', error);
                alert("Erro ao excluir o usuário!");
            });
    }
});


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

/*
var formData = {

name_completo: $("#name").val(),
email: $("#email").val(),
tipo_pessoa: $("#selectOpcao").val(),
cpfcnpj: $("#cpfcnpj").val(),
cep: $("#cep").val(),
endereco: $("#endereco").val(),
bairro: $("#bairro").val(),
cidade: $("#cidade").val(),
estado: $("#estado").val(),
numero: $("#numero").val(),
};


fetch('http://localhost:8080/usuarios', {
method: 'PUT',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify(formData)
})
.then(response => {
    if (!response.ok) {
        throw new Error('Erro ao enviar os dados');
    }
    return response.json();
})
.then(data => {
    console.log('Dados enviados com sucesso:', data);
    alert("Usuário cadastrado com sucesso!")
    // Faça algo com a resposta, se necessário
})
.catch(error => {
    console.error('Erro:', error);
});

*/

