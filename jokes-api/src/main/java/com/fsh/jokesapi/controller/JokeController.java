package com.fsh.jokesapi.controller;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Controller
public class JokeController {

  private final WebClient webClient;

  public JokeController(WebClient.Builder webClientBuilder) {
    this.webClient =
      webClientBuilder.baseUrl("https://api.chucknorris.io").build();
  }

  @GetMapping("/joke")
  @ResponseBody
  public Mono<String> getRandomJoke() {
    return webClient
      .get()
      .uri("/jokes/random")
      .accept(MediaType.APPLICATION_JSON)
      .retrieve()
      .bodyToMono(String.class);
  }
}
