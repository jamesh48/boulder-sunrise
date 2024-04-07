package com.fsh.weatherapi.controller;

import com.fsh.weatherapi.graphql.GraphQLService;
import com.fsh.weatherapi.graphql.KeywordSearchResponse;
import io.aexp.nodes.graphql.GraphQLResponseEntity;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GraphQLController {

  private static final String GRAPHQL_URL = "https://api.meetup.com/gql";

  @GetMapping("/meetups")
  public ResponseEntity<?> invokeGraphQLService(
    @RequestParam("lat") Double lat,
    @RequestParam("lon") Double lon,
    @RequestParam("query") String searchQuery,
    @RequestParam("endDateRange") String endDateRange
  ) {
    try {
      // Call the GraphQL service
      GraphQLResponseEntity<KeywordSearchResponse> responseEntity = GraphQLService.callGraphQLService(
        GRAPHQL_URL,
        lat,
        lon,
        searchQuery,
        endDateRange
      );

      // Handle response
      // if (responseEntity.isOk()) {
      KeywordSearchResponse data = responseEntity.getResponse();
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
