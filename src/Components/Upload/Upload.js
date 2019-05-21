import React, { Component } from 'react'
import './Upload.scss'
import Dropzone from '../Dropzone/Dropzone'

class Upload extends Component {
  constructor(props) {
    super(props)
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
                multiple
                onChange={this.onFilesAdded}
                />
            </div>
        </div>
        <div className="Actions">
            <button>SEND</button>
        </div>
      </div>
    )
  }
}

export default Upload;