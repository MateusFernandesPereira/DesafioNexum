const formCadastro = document.getElementById('formCadastro');
const name = document.getElementById('name');
const email = document.getElementById('email');
const selectOpcao = document.getElementById('selectOpcao');
const cpfcnpj = document.getElementById('cpfcnpj');
const cep = document.getElementById('cep');
const endereco = document.getElementById('endereco');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const estado = document.getElementById('estado');
const numero = document.getElementById('numero');
const tipo = document.getElementById('tipo');

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
                var nome = this.cells[1].textContent;
                var email = this.cells[2].textContent;
                var tipo_pessoa = this.cells[3].textContent;
                var cpfcnpj = this.cells[4].textContent;
                var cep = this.cells[5].textContent;
                var endereco = this.cells[6].textContent;
                var bairro = this.cells[7].textContent;
                var cidade = this.cells[8].textContent;
                var estado = this.cells[9].textContent;
                var numero = this.cells[10].textContent;
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
                            location.reload()
                            // Faça o que for necessário após excluir o usuário com sucesso
                        })
                        .catch(error => {
                            console.error('Erro:', error);
                            // Trate o erro conforme necessário
                        });
                });

                $("#name").val(nome);
                $("#email").val(email);
                $("#selectOpcao").val(tipo_pessoa);
                $("#cpfcnpj").val(cpfcnpj);
                $("#cep").val(cep);
                $("#endereco").val(endereco);
                $("#bairro").val(bairro);
                $("#cidade").val(cidade);
                $("#estado").val(estado);
                $("#numero").val(numero);

                document.querySelector('#modalEdicao .btn-success').addEventListener('click', function () {

                    event.preventDefault(); // Evita o envio automático do formulário

                    var documento = $('#cpfcnpj').val().replace(/\D/g, '');
                    var selectedOption = $('#selectOpcao').children('option:selected').val();

                    // Realize outras validações antes da validação do CPF/CNPJ, se necessário

                    if (!validarCamposObrigatorios()) {
                        alert('Por favor, preencha todos os campos.');
                        return;
                    }

                    // Validando o formato do e-mail
                    var email = $('#email').val();
                    if (!validarEmail(email)) {
                        alert('Por favor, insira um endereço de e-mail válido.');

                        return;
                    }

                    if (selectedOption === 'cpf') {
                        if (!validarCPF(documento)) {
                            alert('CPF inválido');

                            return;
                        }
                    } else if (selectedOption === 'cnpj') {
                        if (!validarCNPJ(documento)) {
                            alert('CNPJ inválido');
                            return;

                        }



                    }

                    atualizar();


                    // Função para validar o formato de e-mail
                    function validarEmail(email) {
                        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return regex.test(email);
                    }

                    function validarCamposObrigatorios() {
                        var camposValidos = true;
                        $('#formCadastro input[required]').each(function () {
                            if (!$(this).val()) {
                                camposValidos = false;
                                return false; // Encerra o loop
                            }
                        });
                        return camposValidos;
                    }

                    function validarCPF(cpf) {
                        var soma = 0;
                        var resto;

                        if (cpf == "00000000000") return false;

                        for (var i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
                        resto = (soma * 10) % 11;

                        if ((resto == 10) || (resto == 11)) resto = 0;
                        if (resto != parseInt(cpf.substring(9, 10))) return false;

                        soma = 0;
                        for (var i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
                        resto = (soma * 10) % 11;

                        if ((resto == 10) || (resto == 11)) resto = 0;
                        if (resto != parseInt(cpf.substring(10, 11))) return false;

                        return true;
                    }

                    function validarCNPJ(cnpj) {
                        cnpj = cnpj.replace(/[^\d]+/g, '');

                        if (cnpj == '') return false;

                        if (cnpj.length != 14) return false;

                        if (cnpj == "00000000000000" ||
                            cnpj == "11111111111111" ||
                            cnpj == "22222222222222" ||
                            cnpj == "33333333333333" ||
                            cnpj == "44444444444444" ||
                            cnpj == "55555555555555" ||
                            cnpj == "66666666666666" ||
                            cnpj == "77777777777777" ||
                            cnpj == "88888888888888" ||
                            cnpj == "99999999999999")
                            return false;

                        var tamanho = cnpj.length - 2
                        var numeros = cnpj.substring(0, tamanho);
                        var digitos = cnpj.substring(tamanho);
                        var soma = 0;
                        var pos = tamanho - 7;
                        for (var i = tamanho; i >= 1; i--) {
                            soma += numeros.charAt(tamanho - i) * pos--;
                            if (pos < 2) pos = 9;
                        }
                        var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                        if (resultado != digitos.charAt(0)) return false;

                        tamanho = tamanho + 1;
                        numeros = cnpj.substring(0, tamanho);
                        soma = 0;
                        pos = tamanho - 7;
                        for (var i = tamanho; i >= 1; i--) {
                            soma += numeros.charAt(tamanho - i) * pos--;
                            if (pos < 2) pos = 9;
                        }
                        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                        if (resultado != digitos.charAt(1)) return false;

                        return true;

                    }


                    function atualizar() {
                        var formData = {
                            id: id,
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
                                alert("Usuário atualizado com sucesso!");
                                location.reload()
                            })
                            .catch(error => {
                                console.error('Erro:', error);
                            });
                    }
                });


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



$(document).ready(function () {

    //Quando o campo cep perde o foco.
    $("#cep").blur(function () {

        //Nova variável "cep" somente com dígitos.
        var cep = $(this).val().replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if (validacep.test(cep)) {

                //Preenche os campos com "Só um instante" enquanto consulta webservice.
                $("#endereco").val("Só um instante");
                $("#bairro").val("Só um instante");
                $("#cidade").val("Só um instante");
                $("#estado").val("Só um instante");

                //Consulta o webservice viacep.com.br/
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.
                        $("#endereco").val(dados.logradouro);
                        $("#bairro").val(dados.bairro);
                        $("#cidade").val(dados.localidade);
                        $("#estado").val(dados.uf);
                    } //caso tenha erro
                    else {
                        //CEP pesquisado não foi encontrado.
                        limpa_formulário_cep();
                        alert("CEP não encontrado.");
                    }
                });
            } //caso tenha tido um formato invalido
            else {
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
            }
        } //caso o campo esteja vazio
        else {
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    });

    $('#selectOpcao').change(function () {
        var selectedOption = $(this).children('option:selected').val();
        if (selectedOption === 'cpf') {
            $('#cpfcnpj').mask('000.000.000-00', { reverse: true });
        } else if (selectedOption === 'cnpj') {
            $('#cpfcnpj').mask('00.000.000/0000-00', { reverse: true });
        }
    }).change();

    selectOpcao.addEventListener('change', function () {
        const selectedOption = selectOpcao.value;
        if (selectedOption === 'cpf') {
            tipo.textContent = 'CPF';
            cpfcnpj.placeholder = 'Digite seu CPF';
        }
        else if (selectedOption === 'cnpj') {
            tipo.textContent = 'CNPJ';
            cpfcnpj.placeholder = 'Digite seu CNPJ';
        }
    })

    function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
        $("#endereco").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#estado").val("");
    }


});