package com.personal.drawingGame.websocket;

import com.personal.drawingGame.common.util.TypeUtil;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class StompController {

    private final SimpMessagingTemplate template;

    @MessageMapping("/enter")
    @SendTo("/topic/enter")
    public Message greeting(Message message) throws InterruptedException {
        Thread.sleep(5000);
        return message;
    }

    @MessageMapping("/game")
    public void sendGameMessage(@RequestParam Map<String, Object> param) {

        try {
            System.out.println("param = " + param);

            String roomCode = TypeUtil.stringValue(param.get("roomId"));
            String type = TypeUtil.stringValue(param.get("type"));
            Message message = new Message();
            message.setUserName(TypeUtil.stringValue(param.get("userName")));
            if(param.get("userId") != null && TypeUtil.longValue(param.get("userId")) > 0L){
                message.setUserId(TypeUtil.longValue(param.get("userId")));
            }
            message.setType(type);
            message.setData(TypeUtil.stringValue(param.get("data")));
            System.out.println("type = " + type);
            if(("submitAnswer").equals(type)){
                message.setWriteAnswer(TypeUtil.stringValue(param.get("writeAnswer")));
            } else if(("correctAnswer").equals(type)){
                message.setCorrectAnswer(TypeUtil.stringValue(param.get("correctAnswer")));
            }
            template.convertAndSend("/sub/game/" + roomCode, message);

        } catch (Exception e){
            e.printStackTrace();
        }

    }
}
