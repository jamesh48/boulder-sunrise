package com.fsh.weatherapi.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.lang.NonNull;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

  private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

  @Override
  public void afterConnectionEstablished(@NonNull WebSocketSession session)
    throws Exception {
    super.afterConnectionEstablished(session);
    // Add the new WebSocket session to the collection
    sessions.put(session.getId(), session);
  }

  @Override
  public void afterConnectionClosed(
    @NonNull WebSocketSession session,
    @NonNull CloseStatus status
  ) throws Exception {
    super.afterConnectionClosed(session, status);
    // Remove the closed WebSocket session from the collection
    sessions.remove(session.getId());

    // Stop polling weather API if no sessions are active
    if (sessions.isEmpty()) {
      stopWeatherPolling();
    }
  }

  // Method to start polling weather API
  public void weatherApiCall() {
    WeatherDataRetriever weatherDataRetriever = new WeatherDataRetriever();

    // Create a map to store unique locations and their corresponding sessions
    Map<String, List<WebSocketSession>> locationSessionsMap = new HashMap<>();

    for (WebSocketSession session : sessions.values()) {
      String locationVal = session
        .getAttributes()
        .get("locationVal")
        .toString();

      // Add the session to the corresponding list of sessions for this location
      locationSessionsMap
        .computeIfAbsent(locationVal, k -> new ArrayList<>())
        .add(session);
    }

    for (String locationKey : locationSessionsMap.keySet()) {
      try {
        String encodedLocation = URLEncoder.encode(
          locationKey,
          StandardCharsets.UTF_8
        );

        String weatherData = weatherDataRetriever.retrieveWeatherData(
          encodedLocation
        );

        // Iterate over sessions for this location and send the weather data
        for (WebSocketSession session : locationSessionsMap.get(locationKey)) {
          if (weatherData != null) {
            session.sendMessage(new TextMessage(weatherData));
          }
        }
      } catch (Exception e) {
        // Handle exception if sending message fails for a session
        e.printStackTrace();
      }
    }
  }

  public int getSessions() {
    return sessions.size();
  }

  // Method to stop polling weather API
  private void stopWeatherPolling() {
    // Stop the background task or scheduled job that polls the weather API
  }

  @Scheduled(fixedRateString = "${weather.polling.fixedRate}")
  public void scheduledWeatherPolling() {
    if (!sessions.isEmpty()) {
      weatherApiCall();
    }
  }

  @Override
  protected void handleTextMessage(
    @NonNull WebSocketSession session,
    @NonNull TextMessage message
  ) throws Exception {
    String payload = message.getPayload();

    try {
      // Attempt to parse the payload as JSON
      // If it fails, a JSONException will be thrown
      JSONObject json = new JSONObject(payload);

      String locationVal = json.getString("locationVal");

      if (locationVal != null && !locationVal.isEmpty()) {
        session.getAttributes().put("locationVal", locationVal);
      }

      sessions.put(session.getId(), session);

      // Handle the valid JSON message
      System.out.println("New Subscription: " + json.get("locationVal"));
    } catch (JSONException e) {
      // If the payload is not valid JSON, throw an exception
      throw new Exception("Invalid JSON format: " + payload);
    }
  }
}
