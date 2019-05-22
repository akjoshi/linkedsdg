import React, { Component } from 'react'
import './Upload.scss'
import axios from 'axios';

class Upload extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    PlainText: null
};

    handleUploadFile = async (event) => {
        const data = new FormData();
        data.append('file', event.target.files[0]);
        console.log(data);
        // '/files' is your node.js route that triggers our middleware
        const text = await axios.post('http://127.0.0.1:5000/api', data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
        //console.log(text.data)
        this.setState({PlainText: text.data})
    }
        

  render() {
    return (
      <div className="Upload">
        <span className="Title">Upload Files</span>
        <div className="Content">
            <div className="File-Upload">
                <input
                className="File-Input"
                type="file"
                onChange={this.handleUploadFile}
                />
            </div>
        </div>
        <div className="Data-Area">
          {this.state.PlainText}
        </div>
      </div>
    )
  }
}

export default Upload;