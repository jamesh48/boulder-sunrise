package com.fsh.weatherapi.graphql;

import java.util.List;


import io.aexp.nodes.graphql.annotations.GraphQLArgument;
import io.aexp.nodes.graphql.annotations.GraphQLProperty;

@GraphQLProperty(name = "keywordSearch", arguments = { @GraphQLArgument(name = "filter") })
public class KeywordSearchResponse {
    // Count
    private Integer count;

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    // Edges
    private List<KeywordSearchEdge> edges;

    public List<KeywordSearchEdge> getEdges() {
        return edges;
    }

    public void setEdges(List<KeywordSearchEdge> edges) {
        this.edges = edges;
    }

    public static class KeywordSearchEdge {
        private String cursor;

        public String getCursor() {
            return cursor;
        }

        public void setCursor(String cursor) {
            this.cursor = cursor;
        }

        private KeywordSearchNode node;

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
        private String howToFindUs;
        private Boolean going;
        private String timezone;
        private EventImage image;
        private String imageUrl;

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

        public String getHowToFindUs() {
            return howToFindUs;
        }

        public void setHowToFindUs(String howToFindUs) {
            this.howToFindUs = howToFindUs;
        }

        public Boolean getGoing() {
            return going;
        }

        public void setGoing(Boolean going) {
            this.going = going;
        }

        public String getTimezone() {
            return timezone;
        }

        public void setTimezone(String timezone) {
            this.timezone = timezone;
        }

        public EventImage getImage() {
            return image;
        }

        public void setImage(EventImage image) {
            this.image = image;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }
    }

    public static class EventImage {
        private String baseUrl;
        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }
    }
}