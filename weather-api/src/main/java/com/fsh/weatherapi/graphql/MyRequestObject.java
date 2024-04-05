package com.fsh.weatherapi.graphql;

import java.util.List;

public class MyRequestObject {

  private AllFilmsData allFilms;

  public AllFilmsData getAllFilms() {
    return allFilms;
  }

  public void setAllFilms(AllFilmsData allFilms) {
    this.allFilms = allFilms;
  }

  public static class AllFilmsData {

    private List<FilmData> films;

    public List<FilmData> getFilms() {
      return films;
    }

    public void setFilms(List<FilmData> films) {
      this.films = films;
    }
  }

  public static class FilmData {

    private String title;

    public String getTitle() {
      return title;
    }

    public void setTitle(String title) {
      this.title = title;
    }
  }
}
