package com.personal.drawingGame.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import javax.xml.ws.Response;
import java.util.Optional;

@RestController
@RequestMapping("/restful/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/user")
    public ResponseEntity<Void> createUser(@RequestBody User user, UriComponentsBuilder builder){
        user.setUserRole(1);
        boolean flag = userService.createUser(user);

        if(!flag){
            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<Void>(HttpStatus.CREATED);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> userList(@PathVariable Long id) {
        Optional<User> user = userService.getUser(id);
        if(user.isPresent()){
            return new ResponseEntity<User>(user.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user){
        User updateUser = userService.updateUser(id, user);
        if(updateUser != null) {
            return new ResponseEntity<User>(updateUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/user/{id}")
    public ResponseEntity<User> patchUser(@PathVariable Long id, @RequestBody User user){
        User updateUser = userService.patchUser(id, user);
        if(updateUser != null){
            return new ResponseEntity<User>(updateUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        if(userService.deleteUser(id)){
            return new ResponseEntity<Void>(HttpStatus.OK);
        } else {
            return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
        }
    }
}
