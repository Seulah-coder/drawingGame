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
            Message message = new Message();
            message.setUserName(TypeUtil.stringValue(param.get("userName")));
            message.setType(TypeUtil.stringValue(param.get("type")));
            message.setData(TypeUtil.stringValue(param.get("data")));
            template.convertAndSend("/sub/game/" + roomCode, message);

        } catch (Exception e){
            e.printStackTrace();
        }

    }
}
