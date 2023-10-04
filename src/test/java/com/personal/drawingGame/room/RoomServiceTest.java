package com.personal.drawingGame.room;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.*;


@RunWith(SpringRunner.class)
@SpringBootTest
public class RoomServiceTest {

    @Autowired
    RoomService roomService;

    @Test
    void createRoom() {
        Room room = new Room();
        Room returnRoom = roomService.createRoom(room);
        System.out.println("returnRoom = " + returnRoom);
        System.out.println("returnRoom.getRoomCode() = " + returnRoom.getRoomCode());
        System.out.println("returnRoom.getId() = " + returnRoom.getId());
    }
}
