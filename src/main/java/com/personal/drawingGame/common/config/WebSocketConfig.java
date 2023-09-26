package com.personal.drawingGame.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;

import java.io.IOException;
import java.util.logging.SocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry){
        try {
            registry.addHandler((WebSocketHandler) signalSocketHandler(), "/room")
                    .setAllowedOrigins("*")
                    .withSockJS();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Bean
    public SocketHandler signalSocketHandler() throws IOException {
        return new SocketHandler();
    }
}
