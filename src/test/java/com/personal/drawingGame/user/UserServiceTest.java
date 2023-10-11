package com.personal.drawingGame.user;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserServiceTest {

    @Autowired
    UserService userService;

    @Test
    public void getUser() {
        User newUser = new User();
        newUser.setUserName("test");
        newUser.setRoomCode("7VHVKT");
        newUser.setUserRole(0);
        userService.createUser(newUser);

        Long userId = 1L;
        Optional<User> user = userService.getUser(newUser.getId());
        System.out.println("user = " + user);
        System.out.println("userId = " + user.get().getUserName());
        System.out.println("userId = " + user.get().getRoomCode());
    }

    @Test
    public void countUserByRoomCode() {
        String roomCode = "7VHVKT";
       Long countId =  userService.countUserByRoomCode(roomCode);
        System.out.println("countId = " + countId);
    }

    @Test
    public void getUsers(){
        String roomCode = "7VHVKT";

        User newUser = new User();
        newUser.setUserName("test");
        newUser.setRoomCode(roomCode);
        newUser.setUserRole(0);
        userService.createUser(newUser);

        User newUser1 = new User();
        newUser1.setUserName("test1");
        newUser1.setRoomCode(roomCode);
        newUser1.setUserRole(0);
        userService.createUser(newUser1);

        User newUser2 = new User();
        newUser2.setUserName("test2");
        newUser2.setRoomCode(roomCode);
        newUser2.setUserRole(0);
        userService.createUser(newUser2);

        List<User> lists = userService.findAllByRoomCode(roomCode);
        System.out.println("lists = " + lists.size());
    }
}