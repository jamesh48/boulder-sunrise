package com.fsh.jokesapi.controller;

import io.github.cdimascio.dotenv.Dotenv;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

public class WeatherDataRetriever {

  public static final String OPENWEATHERMAP_API_KEY;

  static {
    // Load API key from environment variables or .env file
    Dotenv dotenv = Dotenv.configure().load();
    OPENWEATHERMAP_API_KEY = dotenv.get("OPENWEATHERMAP_API_KEY");
  }

  public String retrieveWeatherData() {
    HttpURLConnection connection = null;
    BufferedReader reader = null;
    StringBuilder result = new StringBuilder();
    try {
      URI uri = new URI(
        "https://api.openweathermap.org/data/2.5/weather?lat=40.0149856&lon=-105.270545&appid=" +
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
    System.out.println(result.toString());
    return result.toString();
  }
}
