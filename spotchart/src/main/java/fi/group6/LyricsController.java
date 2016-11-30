package fi.group6;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import fi.group6.chartlyrics.GetLyricResponse;
import fi.group6.chartlyrics.LyricTrackResponse;
import fi.group6.spotify.SpotifyArtist;
import fi.group6.spotify.SpotifyTrackResponse;
import fi.group6.spotify.SpotifyTrackResponse.Track;

@RestController
@RequestMapping("/api/v1")
public class LyricsController {

	String chartLyricsEndPoint = "http://api.chartlyrics.com/apiv1.asmx";
	String spotifyEndPoint = "https://api.spotify.com/v1";
	// Prevent too many API calls - each found song generates two more requests
	int trackLimit = 10;

	RestTemplate restTemplate;

	public LyricsController() {
		this.restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(new MappingJackson2XmlHttpMessageConverter());
	}
	
	@RequestMapping("/search")
    public ResponseEntity<?> search(@RequestParam(value="by_lyrics") String lyrics) {
		String url = chartLyricsEndPoint + "/SearchLyricText?lyricText={lyricText}";
		LyricTrackResponse[] responses = restTemplate.getForObject(url, LyricTrackResponse[].class, lyrics);
		List<LyricTrackResponse> responsesList = Arrays.asList(responses).subList(0, Math.min(trackLimit, responses.length));

		List<SearchResponse> searchResponses = new ArrayList<>();
		for (LyricTrackResponse lyricTrackResponse : responsesList) {
			if (lyricTrackResponse.LyricChecksum != null) {
				GetLyricResponse lyricResponse = getLyric(lyricTrackResponse.LyricId, lyricTrackResponse.LyricChecksum);
				Track track = searchSpotifyTrack(lyricTrackResponse.Artist, lyricTrackResponse.Song);
				if (track != null) {
					searchResponses.add(createSearchResponse(track, lyricResponse));
				}
			}
		}
		return new ResponseEntity<List<SearchResponse>>(searchResponses, HttpStatus.OK);
	}
	
	private SearchResponse createSearchResponse(Track track, GetLyricResponse lyricResponse) {
		SearchResponse searchResponse = new SearchResponse();
		searchResponse.song = track.name;
		searchResponse.artists = new ArrayList<String>();
		for (SpotifyArtist artist : track.artists) {
			searchResponse.artists.add(artist.name);
		}
		searchResponse.lyrics = lyricResponse.Lyric;
		searchResponse.spotifyTrackUri = track.uri;
		if (track.external_urls != null && track.external_urls.containsKey("spotify")) {
			searchResponse.spotifySongLink = track.external_urls.get("spotify");
		}

		return searchResponse;
	}

	private GetLyricResponse getLyric(int lyricId, String lyricChecksum) {
		String url = chartLyricsEndPoint + "/GetLyric?lyricId={lyricId}&lyricCheckSum={lyricChecksum}";
		return restTemplate.getForObject(url, GetLyricResponse.class, lyricId, lyricChecksum);
	}

	private Track searchSpotifyTrack(String artist, String track) {
		String url = spotifyEndPoint + "/search?q={track}&type=track";
		SpotifyTrackResponse response = restTemplate.getForObject(url, SpotifyTrackResponse.class, track);
		for (Track resultTrack : response.tracks.items) {
			// Same song may appear multiple times, check for artist match
			SpotifyArtist spotifyArtist = resultTrack.artists.stream()
		    .filter(a -> a.name.equalsIgnoreCase(artist))
		    .findFirst().orElse(null);
			if (spotifyArtist != null) {
				return resultTrack;
			}
		}
		return null;
	}
}