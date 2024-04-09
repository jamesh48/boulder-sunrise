package com.fsh.weatherapi.graphql;

public enum SortOrder {
  ASC("ASC"),
  DESC("DESC");

  private final String value;

  SortOrder(String value) {
      this.value = value;
  }

  public String getValue() {
      return value;
  }
}