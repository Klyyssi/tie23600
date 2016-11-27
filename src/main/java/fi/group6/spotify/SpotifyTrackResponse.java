package fi.group6.spotify;

import java.util.List;
import java.util.Map;

public class SpotifyTrackResponse {
	public static class Track {
		public Object album;
		
		public List<SpotifyArtist> artists;
		
		public List<String> available_markets;

		public int disc_number;
		
		public int duration_ms;
		
		public boolean explicit;
		
		public Object external_ids;
		
		public Map<String, String> external_urls;
		
		public String href;
		
		public String id;
		
		public boolean is_playable;
		
		public Object linked_from;
		
		public String name;
		
		public int popularity;
		
		public String preview_url;
		
		public int track_number;
		
		public String type;
		
		public String uri;
	}
	
	public static class Tracks {
		public String href;
	
		public List<Track> items;
	
		public int limit;
	
		public Object next;
	
		public int offset;
	
		public Object previous;
	
		public int total;
	}
	
	public Tracks tracks;
}