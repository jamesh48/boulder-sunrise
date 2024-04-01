package com.fsh.jokesapi.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Properties;
import org.json.JSONObject;

public class WeatherDataRetriever {

  public static final String OPENWEATHERMAP_API_KEY;

  static {
    String apiKey = null;

    // First, try to get the API key from system environment variables
    apiKey = System.getenv("OPENWEATHERMAP_API_KEY");

    // If it's not found in system environment variables, try to load it from a .env file
    if (apiKey == null) {
      try {
        File envFile = new File(".env");
        if (envFile.exists()) {
          Properties properties = new Properties();
          properties.load(new FileReader(envFile));
          apiKey = properties.getProperty("OPENWEATHERMAP_API_KEY");
        } else {
          throw new RuntimeException(".env file not found");
        }
      } catch (IOException e) {
        throw new RuntimeException("Error loading .env file", e);
      }
    }

    OPENWEATHERMAP_API_KEY = apiKey;
  }

  public String retrieveWeatherData(String locationVal) {
    HttpURLConnection connection = null;
    BufferedReader reader = null;
    StringBuilder result = new StringBuilder();

    try {
      URI uri = new URI(
        "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" +
        locationVal +
        "&appid=" +
        OPENWEATHERMAP_API_KEY
      );
      URL url = uri.toURL();
      connection = (HttpURLConnection) url.openConnection();
      connection.setRequestMethod("GET");

      reader =
        new BufferedReader(new InputStreamReader(connection.getInputStream()));
      String line;
      while ((line = reader.readLine()) != null) {
        result.append(line);
      }
    } catch (URISyntaxException | IOException e) {
      e.printStackTrace();
    } finally {
      if (reader != null) {
        try {
          reader.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
      if (connection != null) {
        connection.disconnect();
      }
    }
    // Handle TimeStamp
    JSONObject jsonObject = new JSONObject(result.toString());
    LocalDateTime now = LocalDateTime.now();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
      "yyyy-MM-dd HH:mm:ss"
    );
    String timestamp = now.format(formatter);
    jsonObject.put("timestamp", timestamp);

    String updatedWeatherData = jsonObject.toString();

    return updatedWeatherData;
  }
}
