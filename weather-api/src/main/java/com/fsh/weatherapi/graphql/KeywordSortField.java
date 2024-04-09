package com.fsh.weatherapi.graphql;

public enum KeywordSortField {
  RELEVANCE("RELEVANCE"),
  DATETIME("DATETIME");

  private final String value;

  KeywordSortField(String value) {
      this.value = value;
  }

  public String getValue() {
      return value;
  }
}

