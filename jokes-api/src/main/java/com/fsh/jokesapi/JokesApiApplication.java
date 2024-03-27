package com.fsh.jokesapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JokesApiApplication {

  public static void main(String[] args) {
    SpringApplication.run(JokesApiApplication.class, args);
  }
}
