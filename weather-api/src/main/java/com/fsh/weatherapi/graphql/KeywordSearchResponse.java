package com.fsh.weatherapi.graphql;

import java.util.List;

public class KeywordSearchResponse {

  private Integer count;
  private List<KeywordSearchEdge> edges;

  public Integer getCount() {
    return count;
  }

  public void setCount(Integer count) {
    this.count = count;
  }

  public List<KeywordSearchEdge> getEdges() {
    return edges;
  }

  public void setEdges(List<KeywordSearchEdge> edges) {
    this.edges = edges;
  }

  public static class KeywordSearchEdge {

    private String cursor;
    private KeywordSearchNode node;

    public String getCursor() {
      return cursor;
    }

    public void setCursor(String cursor) {
      this.cursor = cursor;
    }

    public KeywordSearchNode getNode() {
      return node;
    }

    public void setNode(KeywordSearchNode node) {
      this.node = node;
    }
  }

  public static class KeywordSearchNode {

    private String id;
    private EventResult result;

    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public EventResult getResult() {
      return result;
    }

    public void setResult(EventResult result) {
      this.result = result;
    }
  }

  public static class EventResult {

    private String title;
    private String eventUrl;
    private String description;
    private String dateTime;
    private Boolean going;

    public String getTitle() {
      return title;
    }

    public void setTitle(String title) {
      this.title = title;
    }

    public String getEventUrl() {
      return eventUrl;
    }

    public void setEventUrl(String eventUrl) {
      this.eventUrl = eventUrl;
    }

    public String getDescription() {
      return description;
    }

    public void setDescription(String description) {
      this.description = description;
    }

    public String getDateTime() {
      return dateTime;
    }

    public void setDateTime(String dateTime) {
      this.dateTime = dateTime;
    }

    public Boolean getGoing() {
      return going;
    }

    public void setGoing(Boolean going) {
      this.going = going;
    }
  }
}
