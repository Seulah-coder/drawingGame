package com.personal.drawingGame.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class StompController {

    @MessageMapping("/enter")
    @SendTo("/topic/enter")
    public Message greeting(Message message) throws InterruptedException {
        Thread.sleep(5000);
        return message;
    }
}
