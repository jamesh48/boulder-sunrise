package com.fsh.weatherapi.config;

import com.fsh.weatherapi.controller.MyWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

  @Override
  public void registerWebSocketHandlers(
    @NonNull WebSocketHandlerRegistry registry
  ) {
    registry
      .addHandler(new MyWebSocketHandler(), "/websocket-endpoint")
      .setAllowedOrigins("*");
  }
}
