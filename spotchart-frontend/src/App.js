import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import {PanelGroup, Panel} from 'react-bootstrap';
// import {songList} from './mock.js';
import {apiURI} from './config.js';
var jquery = require('jquery');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {songList: [], errorMessage: ""};
    this.searchSongs = this.searchSongs.bind(this);
    this.searchSongsBy = this.searchSongsBy.bind(this);
  }

  searchSongsBy(artist, song) {
    jquery.ajax({
      url: apiURI + '/search',
      type: 'GET',
      dataType: 'json',
      data: {'artist': artist, 'song': song},
      cache: false,
      success: function(data) {
        this.setState({ songList: data, errorMessage: "" });
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({
          songList: [],
          errorMessage: status.toString() + ": " + err.toString()
        });
      }.bind(this)
    });
  }

  searchSongs(searchParam) {
    jquery.ajax({
      url: apiURI + '/search',
      type: 'GET',
      dataType: 'json',
      data: {'lyrics': searchParam},
      cache: false,
      success: function(data) {
        this.setState({ songList: data, errorMessage: "" });
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({
          songList: [],
          errorMessage: status.toString() + ": " + err.toString()
        });
      }.bind(this)
    });
  }

  render() {
    return (
      <div>
        <SearchBar searchCallback={this.searchSongs} searcyByArtistCallback={this.searchSongsBy} />
        <ErrorMessage msg={this.state.errorMessage} />
        <SongList songs={this.state.songList} />
      </div>
    );
  }
}

class ErrorMessage extends Component {

  render() {
    const message = this.props.msg === ": " ?
                      "Something went wrong" :
                      this.props.msg;

    return (
      <p className="bg-danger">{message}</p>
    )
  }
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {searchByLyrics: 'true'};
    this.handleArtistChange = this.handleArtistChange.bind(this);
    this.handleLyricsChange = this.handleLyricsChange.bind(this);
  }

  handleLyricsChange(e) {
    this.setState({ searchByLyrics: e.currentTarget.value });
  }

  handleArtistChange(e) {
    this.setState({ searchByLyrics: !e.currentTarget.value });
  }

  render() {
    let searchBar = null;
    let searchByLyrics = this.state.searchByLyrics;

    if (searchByLyrics) {
      searchBar = <LyricsSearchBar searchCallback={this.props.searchCallback} />
    } else {
      searchBar = <ArtistAndSongSearchBar searchCallback={this.props.searcyByArtistCallback} />
    }

    return (
      <div className="form-group">
        <label>Search</label><br />
        <input id="lyrics-rad" type="radio" checked={this.state.searchByLyrics} onChange={this.handleLyricsChange} />
        <label htmlFor="lyrics-rad">By lyrics</label>
        <input id="artist-rad" type="radio" checked={!this.state.searchByLyrics} onChange={this.handleArtistChange} />
        <label htmlFor="artist-rad">By artist & song</label>
        {searchBar}
      </div>
    );
  }
}

class ArtistAndSongSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {artist: '', song: ''};
    this.handleArtistChange = this.handleArtistChange.bind(this);
    this.handleSongChange = this.handleSongChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleArtistChange(e) {
    this.setState({ artist: e.target.value });
  }

  handleSongChange(e) {
    this.setState({ song: e.target.value });
  }

  handleClick(e) {
    this.props.searchCallback(this.state.artist, this.state.song);
  }

  render() {
    return (
      <div>
        <label htmlFor="artist-searchbar">Artist</label>
        <input type="text" className="form-control" id="artist-searchbar"
                value={this.state.artist} onChange={this.handleArtistChange}/>
        <label htmlFor="song-searchbar">Song</label>
        <input type="text" className="form-control" id="song-searchbar"
                value={this.state.song} onChange={this.handleSongChange}/>
        <Button type="submit" onClick={this.handleClick}>Search</Button>
      </div>
    );
  }
}

class LyricsSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {lyrics: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({ lyrics: e.target.value });
  }

  handleClick(e) {
    this.props.searchCallback(this.state.lyrics);
  }

  render() {
    return (
      <div>
        <label htmlFor="lyrics-searchbar">Lyrics</label>
        <input type="text" className="form-control" id="lyrics-searchbar"
                value={this.state.lyrics} onChange={this.handleChange}/>
        <Button type="submit" onClick={this.handleClick}>Search</Button>
      </div>
    );
  }
}

class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {'activeKey': "1"};
    this.handleSelect = this.handleSelect.bind(this);
  }

  formatSongName(artists, song) {
    return artists.join(", ") + " - " + song;
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  render() {
    const activekey = this.state.activeKey;
    const songs = this.props.songs.map((song, i) => {
      return <Panel key={i}
                    header={this.formatSongName(song.artists, song.song)}
                    eventKey={i+1+""}>
                      <Song song={song} />
            </Panel>
    });

    return (
      <PanelGroup activeKey={activekey} onSelect={this.handleSelect} accordion>
          {songs}
      </PanelGroup>
    )
  }
}

class Song extends Component {
  formatEmbedURI() {
    return "https://embed.spotify.com/?uri=" +
            this.props.song['spotify-track-uri'];
  }

  render() {
    const lyrics = this.props.song.lyrics.split("\n").map((line, i) => {
      return <LyricsLine key={i} line={line} />
    });

    return (
      <div>
        <h2>Spotify</h2>
        <iframe src={this.formatEmbedURI()} height="80"
                frameBorder="0" allowTransparency="true"></iframe>
        <a className="block" href={this.props.song['spotify-song-link']}>
          {this.props.song['spotify-song-link']}
        </a>
        <h2>Lyrics</h2>
        <blockquote>
          <p>{lyrics}</p>
        </blockquote>
      </div>
    )
  }
}

class LyricsLine extends Component {
  render() {
    return (
      <div>{this.props.line}<br /></div>
    )
  }
}

export default App;
