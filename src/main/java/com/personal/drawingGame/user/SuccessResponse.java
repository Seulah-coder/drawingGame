package com.personal.drawingGame.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SuccessResponse extends ResponseObject {
    public SuccessResponse(String status, Object data, boolean success, String message) {
        super(status, data, success, message);
    }
}