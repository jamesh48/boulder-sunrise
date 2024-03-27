package com.fsh.jokesapi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WeatherController {

  @GetMapping("/bss-weather")
  @ResponseBody
  public String getWeather() {
    WeatherDataRetriever weatherDataRetriever = new WeatherDataRetriever();
    return weatherDataRetriever.retrieveWeatherData();
  }
}
