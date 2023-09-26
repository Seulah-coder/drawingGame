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

@Controller
@Slf4j
@RequiredArgsConstructor
public class RoomController {

    @Autowired
    UserService userService;

    @GetMapping(value = "/enter")
    public String viewGamePage(){
        return "/game/enter";
    }

    /**
     * 학생 과제 입장 페이지
     * @param model
     * @param roomId
     * @return
     * @throws PersistenceException
     */
    @GetMapping(value = "/enter/{id}")
    public String viewEnterPage(@PathVariable("id") String roomId, User user) throws PersistenceException {
        try {
            userService.createUser(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "/game/waiting";
    }

}
