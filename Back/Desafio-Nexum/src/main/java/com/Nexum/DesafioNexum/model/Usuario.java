package com.Nexum.DesafioNexum.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

@Entity
@Table (name="usuarios")
public class Usuario {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Integer Id;
	
	@Column(name="name_completo", length = 100, nullable = true)
	private String name_completo;
	
	@Column(name="email", length = 100, nullable = true)
	private String email;
	
	@Column(name="tipo_pessoa", length = 4, nullable = true)
	private String tipo_pessoa;
	
	@Column(name="cpfcnpj", length = 20, nullable = true)
	private String cpfcnpj;
	
	@Column(name="cep", length = 20, nullable = true)
	private String cep;
	
	@Column(name="endereco", length = 255, nullable = true)
	private String endereco;
	
	@Column(name="bairro", length = 100, nullable = true)
	private String bairro;
	
	@Column(name="cidade", length = 100, nullable = true)
	private String cidade;
	
	@Column(name="estado", length = 2, nullable = true)
	private String estado;
	
	@Column(name="numero", length = 2, nullable = true)
	private String numero;

	public Integer getId() {
		return Id;
	}

	public void setId(Integer id) {
		Id = id;
	}

	public String getName_completo() {
		return name_completo;
	}

	public void setName_completo(String name_completo) {
		this.name_completo = name_completo;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTipo_pessoa() {
		return tipo_pessoa;
	}

	public void setTipo_pessoa(String tipo_pessoa) {
		this.tipo_pessoa = tipo_pessoa;
	}

	public String getCpfcnpj() {
		return cpfcnpj;
	}

	public void setCpfcnpj(String cpfcnpj) {
		this.cpfcnpj = cpfcnpj;
	}

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}

	public String getEndereco() {
		return endereco;
	}

	public void setEndereco(String endereco) {
		this.endereco = endereco;
	}

	public String getBairro() {
		return bairro;
	}

	public void setBairro(String bairro) {
		this.bairro = bairro;
	}

	public String getCidade() {
		return cidade;
	}

	public void setCidade(String cidade) {
		this.cidade = cidade;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public String getNumero() {
		return numero;
	}

	public void setNumero(String numero) {
		this.numero = numero;
	}

}
	
	
	
	
	
	