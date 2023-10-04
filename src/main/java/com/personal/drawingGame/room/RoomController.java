package com.personal.drawingGame.room;

import com.personal.drawingGame.user.User;
import com.personal.drawingGame.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.exceptions.PersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Slf4j
@RequiredArgsConstructor
public class RoomController {

    @Autowired
    RoomService roomService;

    @Autowired
    UserService userService;

    @GetMapping(value = "/enter")
    public String viewEnterGamePage(){
        return "/game/enter";
    }

    @GetMapping(value = "/enter/{roomId}/{userName}")
    public String viewEnterPage(@PathVariable("roomId") String roomId,@PathVariable("userName") String userName) throws PersistenceException {
        try {

            User user = new User();
            user.setUserName(userName);
            user.setRoomCode(roomId);
            user.setUserRole(1);
            userService.createUser(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "/game/waiting";
    }

    @GetMapping(value = "/createRoom")
    public String viewCreateRoomPage(){
        return "/game/createRoom";
    }

    @PostMapping(value = "/createRoom/{userName}")
    @ResponseBody
    public Room createRoom(@PathVariable("userName") String userName, Model model){
        User user = new User();
        user.setUserName(userName);
        user.setUserRole(0);
        userService.createUser(user);
        Room room = new Room();
        room.setRoomOwnerId(user.getId());
        Room returnRoom = roomService.createRoom(room);
        model.addAttribute("room", returnRoom);

        return returnRoom;
    }

    @GetMapping(value = "/startGame")
    public String viewGamePage(){
        return "/game/gameRoom";
    }

}
