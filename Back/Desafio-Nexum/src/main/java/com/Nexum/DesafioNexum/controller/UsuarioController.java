package com.Nexum.DesafioNexum.controller;

import java.util.List;


import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;


import com.Nexum.DesafioNexum.dao.IUsuario;
import com.Nexum.DesafioNexum.model.Usuario;
import java.util.ArrayList;

@RestController
@CrossOrigin("*")
@RequestMapping("/usuarios")
public class UsuarioController {
	
	
	
	@Autowired
	private IUsuario dao;
	
	@GetMapping
	public List<Usuario> listaUsuarios() {
		
		return (List<Usuario>) dao.findAll();
	}
	
	@PostMapping("/cadastrar")
	public Usuario criarUsuario(@RequestBody Usuario usuario) {
		Usuario usarioNovo = dao.save(usuario);
		return usarioNovo;
	}
	
	@PutMapping
	public Usuario editarUsuario(@RequestBody Usuario usuario) {
		Usuario usarioNovo = dao.save(usuario);;
		return usarioNovo;
	}
	
	@DeleteMapping("/{}id")
	
	
	public void deleteUsuarios(@PathVariable Integer id) {
		
		List<Usuario> usuarioList = new ArrayList<>();
		
        Iterator<Usuario> iterator = usuarioList.iterator();
        while (iterator.hasNext()) {
            Usuario usuario = iterator.next();
            if (usuario.getId().equals(id)) {
                iterator.remove();
            }
        }
    }
};

	
