import axios from "axios";
import React, { Component } from "react";

import { BASE_URL } from '../env'

class Wav extends Component {
  constructor(props) {
    super(props);
    this.state = { playing: false };
  }

  async componentDidMount() {
    var fileId = this.props.props.fileId;
    var url = await (await axios.get(BASE_URL + 'files/' + fileId)).data.fileId;
    var container = '#waveform' + this.props.props.id
    import('wavesurfer.js')
    .then(obj => {
      this.waveform = obj.default.create({
        container: container,
        fillParent: true,
        progressColor: "#064E3B",
        cursorColor: "#FF69B4",
      });
      this.waveform.load(url);
    });
  }

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
    this.waveform.playPause();
  };

  render() {
    var id = this.props.props.id;
    return (
      <div>
        <div id={"waveform" + id} />
        <div className="controls">
          <div onClick={this.handlePlayPause}>
            {this.state.playing ? "Pause" : "Play"}
          </div>
        </div>
      </div>
    );
  }
}

export default Wav;
