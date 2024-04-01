package com.fsh.jokesapi.controller;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HealthCheckController {

  @GetMapping("/healthcheck")
  @ResponseBody
  public ResponseEntity<Object> healthcheck() {
    // Create a JSON object representing the health status
    String status = "healthy";
    String message = "Application is running smoothly";

    // Construct the JSON response
    JSONObject response = new JSONObject();
    response.put("status", status);
    response.put("message", message);

    // Return the JSON response with HTTP status 200 (OK)
    return new ResponseEntity<>(response.toString(), HttpStatus.OK);
  }
}
