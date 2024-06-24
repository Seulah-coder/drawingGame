package com.personal.drawingGame.room;

import com.personal.drawingGame.common.util.TypeUtil;
import com.personal.drawingGame.question.Question;
import com.personal.drawingGame.question.QuestionService;
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

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
@Slf4j
@RequiredArgsConstructor
public class RoomController {

    @Autowired
    RoomService roomService;

    @Autowired
    UserService userService;

    @Autowired
    QuestionService questionService;

    @GetMapping(value = "/")
    public String viewGamePage(){
        return "/game/gameRoom";
    }

    @GetMapping(value = "/enter")
    public String viewEnterGamePage(){
        return "/game/enter";
    }

    @PostMapping(value = "/enter/{roomCode}/{userName}")
    @ResponseBody
    public Map<String, Object> viewEnterPage(@PathVariable("roomCode") String roomCode,@PathVariable("userName") String userName, Model model) throws PersistenceException {
        Map<String, Object> returnMap = new HashMap<>();
        try {

            User user = new User();
            user.setUserName(userName);
            user.setUserRole(1);
            user.setAskingYn("N");

            Room findRoom = roomService.getRoomByRoomCode(roomCode);
            if(findRoom != null){
                user.setRoomCode(findRoom.getRoomCode());
                userService.createUser(user);
                returnMap.put("user", user);
            } else {
                returnMap.put("error", "해당 이름으로 생성된 방 없음");
            }

            System.out.println("user = " + user.getId());


        } catch (Exception e) {
            e.printStackTrace();
        }
        return returnMap;
    }

    @GetMapping(value = "/createRoom")
    public String viewCreateRoomPage(){
        return "/game/createRoom";
    }

    @GetMapping(value = "/drawing")
    public String viewDrawingPage(Model model){
        Question question = questionService.getQuestion();
        model.addAttribute("question", question);
        return "/game/drawing";
    }

    @GetMapping(value = "/drawingView")
    public String viewDrawingViewPage(){
        return "/game/drawingView";
    }

    @GetMapping(value = "/answering")
    public String viewAnsweringPage(){
        return "/game/answering";
    }

    @PostMapping(value = "/createRoom/{userName}")
    @ResponseBody
    public Map<String, Object> createRoom(@PathVariable("userName") String userName, Model model){
        Map<String, Object> returnMap = new HashMap<>();
        User user = new User();
        user.setUserName(userName);
        user.setUserRole(0);
        user.setAskingYn("Y");
        userService.createUser(user);

        Room room = new Room();
        room.setRoomOwnerId(user.getId());
        Room returnRoom = roomService.createRoom(room);


        user.setRoomCode(room.getRoomCode());
        userService.updateUser(user.getId(), user);
        model.addAttribute("user", user);
        model.addAttribute("room", returnRoom);

        returnMap.put("user", user);
        returnMap.put("room", returnRoom);

        return returnMap;
    }

    @GetMapping(value = "/startGame/{roomId}/{ownerId}")
    public String viewGamePage(@PathVariable("roomId") String roomId, @PathVariable("ownerId") String ownerId,  Model model){
        if(ownerId != null && !ownerId.equals("")){
            Long id = TypeUtil.longValue(ownerId);
            Optional<User> user = userService.getUser(id);
            model.addAttribute("user", user);

        } else {
            model.addAttribute("role", "theOther");
        }
        model.addAttribute("roomCode", roomId);

        return "/game/gameRoom";
    }

}
