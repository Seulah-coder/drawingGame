package com.personal.drawingGame.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseObject {
    // #. 상태 (400, 404 등)
    private String status;
    // #. 기타 필요한 데이터
    private Object data;
    // #. 성공 여부
    private boolean success;
    // #. 실제 메시지
    private String message;
}
