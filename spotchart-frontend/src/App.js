import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import {PanelGroup, Panel} from 'react-bootstrap';
import {songList} from './mock.js';
//import logo from './logo.svg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {songList: []};
    this.searchSongs = this.searchSongs.bind(this);
  }

  searchSongs(searchParam) {
    console.log("Searching songs with parameter " + searchParam);
    this.setState({songList: songList});
    
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

  formatSongName(artist, song) {
    return artist + " - " + song;
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  render() {
    const activekey = this.state.activeKey;
    const songs = this.props.songs.map((song, i) => {
      return <Panel key={i} header={this.formatSongName(song.artist, song.song)} eventKey={i+1+""}><Song song={song} /></Panel>
    });

    return (
      <PanelGroup activeKey={activekey} onSelect={this.handleSelect} accordion>
          {songs}
      </PanelGroup>
    )
  }
}

class Song extends Component {
  render() {
    return (
      <div>
        <blockquote>
          <p>{this.props.song.lyrics}</p>
        </blockquote>
      </div>
    )
  }
}

export default App;
