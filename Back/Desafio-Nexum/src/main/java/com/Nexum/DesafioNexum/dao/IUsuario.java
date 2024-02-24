package com.Nexum.DesafioNexum.dao;

import org.springframework.data.repository.CrudRepository;

import com.Nexum.DesafioNexum.model.Usuario;



public interface IUsuario extends CrudRepository<Usuario, Integer>{

}