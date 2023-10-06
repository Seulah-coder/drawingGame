package com.personal.drawingGame.websocket;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Message {

    private Long id;
    public String data;
    public String sendMessage;
    public String type;
    public String userName;


}
