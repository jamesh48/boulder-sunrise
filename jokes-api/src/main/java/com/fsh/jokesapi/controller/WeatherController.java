package com.fsh.jokesapi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WeatherController {

  @GetMapping("/bss-weather")
  @ResponseBody
  public String getWeather(@RequestParam(required = false) String location) {
    WeatherDataRetriever weatherDataRetriever = new WeatherDataRetriever();
    return weatherDataRetriever.retrieveWeatherData(location);
  }
}
