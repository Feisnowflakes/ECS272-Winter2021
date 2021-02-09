import React from 'react';
import { Layout } from 'antd';
import BarChart from './BarChart';
import ParallelView from './ParallelView'
// import data from  './datasets/SF_Historical_Ballot_Measures.csv';
import data from './datasets/data.csv';
import data_by_year from './datasets/data_by_year.csv';
import data_w_genres from  './datasets/data_w_genres.csv';
import data_by_artist from  './datasets/data_by_artist.csv';
import iris_data from './datasets/iris.csv';
import './App.css';
import YearView from './YearView';
import PopularityView from './PopularityView';
import YearDetailView from './YearDetailView';
import RadarView from './RadarView';
import Top10SongView from './Top10SongView';
import Top10ArtistView from './Top10ArtistView';
import { timeThursdays } from 'd3';

const { Sider, Content, Footer } = Layout;

class App extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      data: data,
      data_by_year: data_by_year,
      data_w_genres: data_w_genres,
      data_by_artist: data_by_artist,
      iris_data: iris_data,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      maxWidth: 1500,
      keys: ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "valence"],
      colors: ['#e75656','#3c97da','#9dd866','#7a5ebc','#f6c85f','#8dddd0','#a65628','#1a1334', '#aa88cc', '#22bb88'],
      change_year: (posX)=>{
        var year = Math.round(posX / this.state.year_view.state.width * this.state.year_view.state.scale + this.state.year_view.state.curMinYear);
        // this.state.year_view.state.curYear = year;
        // this.state.year_view.updateChart();
        this.state.top_10_song.changeYear(year);
        this.state.top_10_artist.changeYear(year);
      },
      update_cur_year: (posX)=> {
        return Math.round(posX / this.state.year_view.state.width * this.state.year_view.state.scale + this.state.year_view.state.curMinYear);
      },
      change_selected: (index)=>{
        console.log(index);
        this.state.top_10_song.changeSelected(index);
        this.state.top_10_artist.changeSelected(index);
      },
      change_scale: (deltaY, posX)=>{
        console.log(this.state.year_view.state.scale);
        if(deltaY <= 0)
        {
          this.state.year_view.state.scale -= 10;
          if(this.state.year_view.state.scale < this.state.year_view.state.minScale) {
            this.state.year_view.state.scale = this.state.year_view.state.minScale;
          }
        }
        else if(deltaY > 0)
        {
          this.state.year_view.state.scale += 10;
          if(this.state.year_view.state.scale > this.state.year_view.state.maxScale) {
            this.state.year_view.state.scale = this.state.year_view.state.maxScale;
          }
        }

        this.state.year_view.state.curYear = Math.round(posX / this.state.year_view.state.width * this.state.year_view.state.scale + this.state.year_view.state.curMinYear);
        console.log(this.state.year_view.state.curYear);
        this.state.year_view.updateChart();
      },
      change_key: (index) =>{
        this.state.year_detail_view.state.change_keys(index);
      },
      update_hover: (index)=>{
        console.log(index);
        this.state.year_view.state.hover = index;
        this.state.year_view.updateChart();
      },
      set_top_10_song: (ref)=>{this.state.top_10_song = ref;},
      set_top_10_artist: (ref)=>{this.state.top_10_artist = ref;},
      set_year_view: (ref)=>{this.state.year_view = ref;},
      set_year_detail_view: (ref)=>{this.state.year_detail_view = ref;},
      id: "chart-1"
    }
  }

  componentDidMount() {
    var handleResize = () => {
      console.log('resized to: ', window.innerWidth, 'x', window.innerHeight);
      this.setState({ innerWidth: window.innerWidth });
      console.log(this.state.innerWidth);
      this.forceUpdate();
      this.render();
    }
  
    window.addEventListener('resize', handleResize)
  }

  render(){
    return (
      // <div className="App">
      //   <h2>ECS 272 Assignment 3 D3 Template</h2>
      //   <div id="container"> 
      //   <div id="tooltip"></div>
      //   </div>
      //   <BarChart data={this.state.data} width={this.state.width} height={this.state.height} />
      // </div>
      
      <div id="app">
        <header>
          <h1>Spotify Music Audio Features Dataset 1921-2020</h1>
        </header>
        <div id="pad"></div>
        <div id="display">
          <div id="left-view">
            <YearView
              id="year-view"
              change_year={this.state.change_year}
              change_scale={this.state.change_scale} 
              set_year_view={this.state.set_year_view}
              update_cur_year={this.state.update_cur_year}
              change_key = {this.state.change_key}
              update_hover = {this.state.update_hover}
              size={{width: "850", height:"400", margin:{left:50, right:40, top:20, bottom:40}}} 
              data={this.state.data} 
              data_by_year={this.state.data_by_year} 
              keys={this.state.keys} 
              colors={this.state.colors}>
            </YearView>
            <YearDetailView id="year-detail-view" change_selected={this.state.change_selected} set_year_detail_view={this.state.set_year_detail_view} size={{width: "850", height:"200", margin:{left:50, right:40, top:20, bottom:40}}} data={this.state.data} data_by_year={this.state.data_by_year} keys={this.state.keys} colors={this.state.colors}></YearDetailView>
          </div>
          <div id="right-view">
            <Top10SongView id="top-10-song-view" set_top_10_song={this.state.set_top_10_song} size={{width:"400", height:"300", margin:{left:80, right:40, top:40, bottom:100}}} data={this.state.data} data_by_year={this.state.data_by_year} keys={this.state.keys} colors={this.state.colors}></Top10SongView>
            <Top10ArtistView id="top-10-artist-view" set_top_10_artist={this.state.set_top_10_artist} size={{width:"400", height:"300", margin:{left:80, right:40, top:40, bottom:100}}} data={this.state.data} data_by_artist={this.state.data_by_artist} keys={this.state.keys} colors={this.state.colors}></Top10ArtistView>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
