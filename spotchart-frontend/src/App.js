import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import {PanelGroup, Panel} from 'react-bootstrap';
// import {songList} from './mock.js';
import {apiURI} from './config.js';
var jquery = require('jquery');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {songList: []};
    this.searchSongs = this.searchSongs.bind(this);
  }

  searchSongs(searchParam) {
    jquery.ajax({
      url: apiURI + '/search',
      type: 'GET',
      dataType: 'json',
      data: {'by_lyrics': searchParam},
      cache: false,
      success: function(data) {
        this.setState({ songList: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(apiURI + '/search', status, err.toString());
      }
    });
  }

  render() {
    return (
      <div>
        <SearchBar searchCallback={this.searchSongs} />
        <SongList songs={this.state.songList} />
      </div>
    );
  }
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {searchParam: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({ searchParam: e.target.value });
  }

  handleClick(e) {
    this.props.searchCallback(this.state.searchParam);
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor="searchbar">Search by song or lyrics</label>
        <input type="text" className="form-control" id="searchbar" value={this.state.value} onChange={this.handleChange}/>
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
      return <Panel key={i} header={this.formatSongName(song.artists, song.song)} eventKey={i+1+""}><Song song={song} /></Panel>
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
    return "https://embed.spotify.com/?uri=" + this.props.song['spotify-track-uri'];
  }

  render() {
    const lyrics = this.props.song.lyrics.split("\n").map(line => {
      return <LyricsLine line={line} />
    });

    return (
      <div>
        <h2>Spotify</h2>
        <iframe src={this.formatEmbedURI()} height="80" frameBorder="0" allowTransparency="true"></iframe>
        <a className="block" href={this.props.song['spotify-song-link']}>{this.props.song['spotify-song-link']}</a>
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
