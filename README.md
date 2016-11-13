# TIE-23600 Harjoitustyö

## Kuvaus

Harjoitustyönä luodaan REST-rajapinta, joka integroi kaksi ulkoista internetin yli toimivaa rajapintaa. 
Rajapinnoiksi on valittu Spotifyn Web API, ja ChartLyrics API.

### Rajapinta 1: Spotify Web API

Spotifyn rajapinnasta voidaan hakea kappaleeseen liittyviä metatietoja, kuten musiikkigenret ja kuvia.
Tärkeimpänä tietona on kuitenkin spotifyn kappalekohtaiset linkit, esim: https://play.spotify.com/artist/0TnOYISbd1XYRBk9myaseg?play=true&utm_source=open.spotify.com&utm_medium=open
Dokumentaatio: https://developer.spotify.com/web-api/

### Rajapinta 2: ChartLyrics API

ChartLyricsin rajapinnasta haetaan kappaleeseen liittyvät lyriikat. ChartLyricsin rajapintaa voidaan käyttää myös
etsimään kappaleita lyriikoiden perusteella. 
Dokumentaatio: http://www.chartlyrics.com/api.aspx

### Esimerkki kyselystä ja palautettavasta datasta

#### Query:
```
GET /api/v1/search?by_lyrics=punk rocker
```

#### Response
```
{
  [
    song: "Sheena is a punk rocker",
    artist: "Ramones",
    lyrics: "Well the kids are all hopped up and ready to go...",
    spotify-track-uri: "spotify:track:2UnY8ApZT4roi66n1LDAil",
    spotify-song-link: "https://open.spotify.com/track/2UnY8ApZT4roi66n1LDAil",
    images: [..., ...],
    genre: ["punk", "rock"]
  ],
  [
    ...
  ]
}
```

## Ryhmä
Sampo Tolvanen <br />
Markus Mulkahainen
