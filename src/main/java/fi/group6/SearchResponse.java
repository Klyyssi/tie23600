package fi.group6;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchResponse {
	public String song;

   	public List<String> artists;

    public String lyrics;

    @JsonProperty("spotify-track-uri")
    public String spotifyTrackUri;

    @JsonProperty("spotify-song-link")
    public String spotifySongLink;
}