import "babel-polyfill";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { render } from "react-dom";
import "./popup.scss";
import ToggleSwitch from "../components/ToggleSwitch"
import InputRangeSlider from "../components/InputRangeSlider"
import InputFormattedTime from "../components/InputFormattedTime"
import styled from "styled-components"

// const TIME_REGEX = /^([0-9])?:?([0-5]?[0-9]):([0-5][0-9])$/
// 
// function isFormattedTime(str: string) {
//   return str.match(timeRegex)
// }
// 
// function toSeconds(formattedTime: string): number {
//   const mateches = formattedTime.match(timeRegex)
//   if (!mateches) {
//     return 0
//     throw new Error(`invalid time formate: ${formattedTime}`)
//   }
//   const [_, HH, mm, ss] = mateches
//   const hours = HH ? parseInt(HH, 0) * 60 * 60 : 0
//   const minutes = mm ? parseInt(mm, 0) * 60 : 0
//   const seconds = ss ? parseInt(ss, 0) : 0
//   return hours + minutes + seconds
// }

function setLocalStorage(obj): Promise<void> {
  return new Promise( (resolve) => {
    chrome.storage.local.set( obj, () => resolve() );
  });
}

function getLocalStorage(key = null): Promise<any> {
  return new Promise( (resolve) => {
    chrome.storage.local.get(key, (item) => {
      key ? resolve(item[key]) : resolve(item);
    });
  });
}

const Container = styled.div`
  vertical-align: middle;
  color: #fff;
  margin: 0px auto;
  background-color: #000;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
`;

const Row = styled.div`
  display:flex;
  justify-content:space-between;
  padding: 20px;
`;

const Button = styled.div`
  background-color: #fff;
  border-radius: 2px;
  border-color: #dbdbdb;
  border-width: 1px;
  color: #363636;
  cursor: pointer;
  justify-content: center;
  padding-bottom: calc(.5em - 1px);
  padding-left: 1em;
  padding-right: 1em;
  padding-top: calc(.5em - 1px);
  text-align: center;
  white-space: nowrap;
  :hover {
    background-color: #1565c0;
    color: #fff;
    -webkit-transition: .4s;
    transition: .4s;
  }
`

class Popup extends React.Component {

  // impossible to use async, await here
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {
      isInitialized: false,
      flipped: false,
      playbackRate: 1.0,
      start: null,
      end: null
    }
  }

  async componentDidMount() {
    const { flipped, playbackRate, start, end } = await getLocalStorage()
    this.setState({
      isInitialized: true,
      flipped,
      playbackRate: playbackRate || 1.0,
      start,
      end
    })
  }

  handleFlip(e: ChangeEvent) {
    const flipped: boolean = e.target.checked
    this.setState({flipped})
    chrome.storage.local.set({flipped})
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, this.state, function(response) {
        console.log(response)
      })
    });    
  }

  handleInputPlaybackRate(playbackRate: number) {
    this.setState({playbackRate})
    chrome.storage.local.set({playbackRate})
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, this.state, function(response) {
        console.log(response)
      })
    });    
  }

  handleStartChange(start: string): void {
    this.setState({start})
    chrome.storage.local.set({start})
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, this.state, function(response) {
        console.log(response)
      })
    });    
  }

  handleEndChange(end: string): void {
    this.setState({end})
    chrome.storage.local.set({end})
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, this.state, function(response) {
        console.log(response)
      })
    });    
  }

  handleReset(): void {
    this.setState({
      isRestarting: true
      isInitialized: true,
      flipped: false,
      playbackRate: 1.0,
      start: null,
      end: null
    })
    chrome.storage.local.clear()
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, this.state, function(response) {
        console.log(response)
      })
    });    
  }

  render() {
    if (!this.state.isInitialized) {
      return <Container><div style={{height:"300px"}}>loading...</div></Container>
    } else if (this.state.isRestarting) {
      // XXX: I'm not sure how do I rerender uncontrolled components...
      setTimeout(() => this.setState({isRestarting: false}), 1)
      return <Container><div style={{height:"300px"}}>restarting...</div></Container>
    }

    const { flipped, playbackRate, start, end } = this.state
    return (
      <Container>
        <Row><div>repeatify</div></Row>
        <Row>
          <div>flip horizontally</div>
          <ToggleSwitch 
            defaultChecked={this.state.flipped} 
            onChange={this.handleFlip.bind(this)} 
          />
        </Row>
        <Row>
          <div>playback rate</div>
          <div>x{ this.state.playbackRate }</div>
          <div>
            <InputRangeSlider 
              min={0.1} 
              max={2.0} 
              step={0.05} 
              defaultValue={this.state.playbackRate}
              onInput={this.handleInputPlaybackRate.bind(this)} 
            />
          </div>
        </Row>
        <Row>
          <div>start <InputFormattedTime placeholder="0:05" defaultValue={start} onChange={this.handleStartChange.bind(this)} /></div>
      <div>end <InputFormattedTime placeholder="0:15" defaultValue={end} onChange={this.handleEndChange.bind(this)} /></div>
        </Row>
        <Row>
          <div></div>
          <div>
            <Button onClick={this.handleReset.bind(this)}>reset</Button>
          </div>
        </Row>
      </Container>
    )
  }
};

render(<Popup />, document.getElementById("root"));
