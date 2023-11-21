package com.personal.drawingGame.websocket;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
/*
    메시지 DTO
 */
public class Message {

    public Long id;
    //jsonData - 그리기 데이터
    public String data;

    //뭐지 테스트 인가? 봐서 지울 예정
    public String sendMessage;
    //메시지 타입
    public String type;

    //유저 정보
    public Long userId;
    public String userName;
    public int userRole;

    //정답 맞추는 데이타
    //correct userName 추가 필요할 듯?
    public String writeAnswer;
    public String correctAnswer;


}
