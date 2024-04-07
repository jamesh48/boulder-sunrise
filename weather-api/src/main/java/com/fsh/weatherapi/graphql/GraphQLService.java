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
    "query($filter: SearchConnectionFilter!) {\n" +
    "  keywordSearch(filter: $filter) {\n" +
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
    String searchQuery
  ) throws IOException {
    GraphQLTemplate graphQLTemplate = new GraphQLTemplate();

    SearchSources events = SearchSources.EVENTS;
    InputObject<Object> meetupInput = new InputObject.Builder<Object>()
      .put("lat", lat)
      .put("lon", lon)
      .put("source", events)
      .put("query", searchQuery)
      .put("eventType", EventType.PHYSICAL)
      .build();

    GraphQLRequestEntity requestEntity = GraphQLRequestEntity
      .Builder()
      .url(url)
      .request(query)
      .variables(new Variable<Object>("filter", meetupInput.getMap()))
      .build();

    return graphQLTemplate.query(requestEntity, KeywordSearchResponse.class);
  }
}
