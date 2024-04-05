package com.fsh.weatherapi.graphql;

import io.aexp.nodes.graphql.GraphQLRequestEntity;
import io.aexp.nodes.graphql.GraphQLResponseEntity;
import io.aexp.nodes.graphql.GraphQLTemplate;
import java.io.IOException;

public class GraphQLService {

  public static GraphQLResponseEntity<MyRequestObject> callGraphQLService(
    String url
    // String query
  ) throws IOException {
    GraphQLTemplate graphQLTemplate = new GraphQLTemplate();

    GraphQLRequestEntity requestEntity = GraphQLRequestEntity
      .Builder()
      .url(url)
      .request(MyRequestObject.class)
      .build();

    return graphQLTemplate.query(requestEntity, MyRequestObject.class);
  }
}
