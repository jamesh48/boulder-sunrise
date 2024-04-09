package com.fsh.weatherapi.graphql;

import io.aexp.nodes.graphql.GraphQLRequestEntity;
import io.aexp.nodes.graphql.GraphQLResponseEntity;
import io.aexp.nodes.graphql.GraphQLTemplate;
import io.aexp.nodes.graphql.InputObject;
import io.aexp.nodes.graphql.Variable;
import java.io.IOException;

enum SearchSources {
  EVENTS,
  Groups,
}

enum EventType {
  ONLINE,
  PHYSICAL,
  HYBRID,
}

public class GraphQLService {

  public static String query =
    "query($filter: SearchConnectionFilter!, $sort: KeywordSort!) {\n" +
    "  keywordSearch(filter: $filter, sort: $sort) {\n" +
    "    count\n" +
    "    edges {\n" +
    "      cursor\n" +
    "      node {\n" +
    "        id\n" +
    "        result {\n" +
    "          ... on Event {\n" +
    "            title\n" +
    "            howToFindUs\n" +
    "            eventUrl\n" +
    "            description\n" +
    "            shortDescription\n" +
    "            dateTime\n" +
    "            endTime\n" +
    "            going\n" +
    "            timezone\n" +
    "            imageUrl\n" +
    "            topics {\n" +
    "              count\n" +
    "              edges {\n" +
    "               cursor\n" +
    "               node {\n" +
    "                 id\n" +
    "                 name\n" +
    "                 }\n" +
    "              }\n" +
    "            }\n" +
    "            image {\n" +
    "              baseUrl\n" +
    "            }\n" +
    "            venue {\n" +
    "              name\n" +
    "              address\n" +
    "              city\n" +
    "              state\n" +
    "              postalCode\n" +
    "            }\n" +
    "          }\n" +
    "        }\n" +
    "      }\n" +
    "    }\n" +
    "  }\n" +
    "}";

  public static GraphQLResponseEntity<KeywordSearchResponse> callGraphQLService(
    String url,
    Double lat,
    Double lon,
    String searchQuery,
    String endDateRange,
    Float radius,
    String keywordSortFieldString
  ) throws IOException {
    GraphQLTemplate graphQLTemplate = new GraphQLTemplate();

    SearchSources events = SearchSources.EVENTS;
    InputObject<Object> meetupInput = new InputObject.Builder<Object>()
      .put("lat", lat)
      .put("lon", lon)
      .put("source", events)
      .put("query", searchQuery)
      .put("eventType", EventType.PHYSICAL)
      .put("endDateRange", endDateRange)
      .put("radius", radius)
      .build();

      KeywordSortField keywordSortField;
      try {
          // Convert sortOrderString to SortOrder enum
          keywordSortField = KeywordSortField.valueOf(keywordSortFieldString.toUpperCase());
      } catch (IllegalArgumentException e) {
          throw new IllegalArgumentException("Invalid keywordSortField: " + keywordSortFieldString, e);
      }


      InputObject<Object> keywordSort = new InputObject.Builder<Object>()
      .put("sortOrder", SortOrder.ASC.getValue())
      .put("sortField", keywordSortField.getValue())
      .build();


    GraphQLRequestEntity requestEntity = GraphQLRequestEntity
      .Builder()
      .url(url)
      .request(query)
      .variables(new Variable<Object>("filter", meetupInput.getMap()), new Variable<Object>("sort", keywordSort.getMap()))
      .build();

      // System.out.println(requestEntity.getRequest());

    return graphQLTemplate.query(requestEntity, KeywordSearchResponse.class);
  }
}
