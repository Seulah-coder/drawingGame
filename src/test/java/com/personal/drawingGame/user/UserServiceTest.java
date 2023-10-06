package com.personal.drawingGame.user;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

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
        newUser.setRoomCode("TTTTTT");
        newUser.setUserRole(0);
        userService.createUser(newUser);

        Long userId = 1L;
        Optional<User> user = userService.getUser(newUser.getId());
        System.out.println("user = " + user);
        System.out.println("userId = " + user.get().getUserName());
        System.out.println("userId = " + user.get().getRoomCode());
    }
}