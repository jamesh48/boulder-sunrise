package com.fsh.weatherapi.controller;

import com.fsh.weatherapi.graphql.GraphQLService;
import com.fsh.weatherapi.graphql.KeywordSearchResponse;
import io.aexp.nodes.graphql.GraphQLResponseEntity;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GraphQLController {

  @Value("${meetup.graphql.endpoint}")
  private String graphqlUrl;

  @GetMapping("/meetups")
  public ResponseEntity<?> invokeGraphQLService(
      @RequestParam("lat") Double lat,
      @RequestParam("lon") Double lon,
      @RequestParam("query") String searchQuery,
      @RequestParam("endDateRange") String endDateRange,
      @RequestParam("radius") float radius,
      @RequestParam("keywordSortField") String keywordSortFieldString
     ) {
    try {
      // Call the GraphQL service
      GraphQLResponseEntity<KeywordSearchResponse> responseEntity = GraphQLService.callGraphQLService(
          graphqlUrl,
          lat,
          lon,
          searchQuery,
          endDateRange,
          radius,
          keywordSortFieldString
          );

      // Handle response
      KeywordSearchResponse data = responseEntity.getResponse();
      return ResponseEntity.ok(data); // Return data as response
    } catch (IOException e) {
      // Handle exception...
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Exception occurred: " + e.getMessage());
    }
  }
}