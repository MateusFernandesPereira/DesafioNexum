//troca da label e da placeholder do CPF/CNPJ


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

 
 $(document).ready(function() {

                //Quando o campo cep perde o foco.
                $("#cep").blur(function() {
                
                    //Nova variável "cep" somente com dígitos.
                    var cep = $(this).val().replace(/\D/g, '');
                
                    //Verifica se campo cep possui valor informado.
                    if (cep != "") {
                
                        //Expressão regular para validar o CEP.
                        var validacep = /^[0-9]{8}$/;
                
                        //Valida o formato do CEP.
                        if(validacep.test(cep)) {
                
                            //Preenche os campos com "Só um instante" enquanto consulta webservice.
                            $("#endereco").val("Só um instante");
                            $("#bairro").val("Só um instante");
                            $("#cidade").val("Só um instante");
                            $("#estado").val("Só um instante");
                
                            //Consulta o webservice viacep.com.br/
                            $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {
                
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


                $('#selectOpcao').change(function(){
                  var selectedOption = $(this).children('option:selected').val();
                  if(selectedOption === 'cpf'){
                    $('#cpfcnpj').mask('000.000.000-00', {reverse: true});
                  } else if(selectedOption === 'cnpj'){
                    $('#cpfcnpj').mask('00.000.000/0000-00', {reverse: true});
                  }
                }).change();



                selectOpcao.addEventListener('change', function() {
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



                $('#formCadastro').submit(function(event) {


                    var documento = $('#cpfcnpj').val().replace(/\D/g, '');
                    var selectedOption = $('#selectOpcao').children('option:selected').val();
                    
                    // Realize outras validações antes da validação do CPF/CNPJ, se necessário
                    

                    if(selectedOption === 'cpf'){
                      if(!validarCPF(documento)){
                        alert('CPF inválido');
                        return;
                      }
                    } else if(selectedOption === 'cnpj'){
                      if(!validarCNPJ(documento)){
                        alert('CNPJ inválido');
                        return;
                      }
                    }
                    
                    // Se todas as validações passarem, envie os dados do formulário para o endpoint Java


                    var formData = {
                      
                      name: name,
                      email: email,
                      selectOpcao: selectOpcao,
                      cpfcnpj: cpfcnpj,
                      cep: cep,
                      endereco: endereco,
                      bairro: bairro,
                      cidade: cidade,
                      estado: estado,
                      numero: numero,
                    };
                    
                    fetch('http://localhost:8080/usuarios', {
                      method: 'POST',
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
                      // Faça algo com a resposta, se necessário
                    })
                    .catch(error => {
                      console.error('Erro:', error);
                    });
                  });
                  


                  

                  function cadastrar(){
                    fetch("http://localhost:8080/usuarios",
                      {
                          headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                          },
                          method: "POST",
                          body: JSON.stringify({
                              name: name.value,
                              email: email.value,
                              selectOpcao: selectOpcao.value,
                              cpfcnpj: cpfcnpj.value,
                              cep: cep.value,
                              endereco: endereco.value,
                              bairro: bairro.value,
                              cidade: cidade.value,
                              estado: estado.value,
                              numero: numero.value,
                          })
                          .then(function(res) {console.log(res)})
                          .catch(function(res) {console.log(res)})
                      }
                    
                    )
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
                    var numeros = cnpj.substring(0,tamanho);
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
                    numeros = cnpj.substring(0,tamanho);
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


                  function limpa_formulário_cep() {
                    // Limpa valores do formulário de cep.
                    $("#endereco").val("");
                    $("#bairro").val("");
                    $("#cidade").val("");
                    $("#estado").val("");
                }
                  
              });
