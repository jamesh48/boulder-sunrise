package com.fsh.weatherapi.controller;

import com.fsh.weatherapi.graphql.GraphQLService;
import com.fsh.weatherapi.graphql.MyRequestObject;
import io.aexp.nodes.graphql.GraphQLResponseEntity;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GraphQLController {

  // Star Wars Movie Api
  private static final String GRAPHQL_URL =
    "https://swapi-graphql.netlify.app/.netlify/functions/index";

  @GetMapping("/meetups")
  public ResponseEntity<?> invokeGraphQLService() {
    try {
      // Call the GraphQL service
      GraphQLResponseEntity<MyRequestObject> responseEntity = GraphQLService.callGraphQLService(
        GRAPHQL_URL
      );

      // Handle response
      // if (responseEntity.isOk()) {
      MyRequestObject data = responseEntity.getResponse();
      // Process data...
      return ResponseEntity.ok(data); // Return data as response
      // } else {
      // Handle error...
      // return ResponseEntity
      // .status(HttpStatus.INTERNAL_SERVER_ERROR)
      // .body("Error occurred");
      // }
    } catch (IOException e) {
      // Handle exception...
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("Exception occurred: " + e.getMessage());
    }
  }
}
