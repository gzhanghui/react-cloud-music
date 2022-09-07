import React, { Component } from "react";
import PropTypes from 'prop-types'
export default class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            startX: 0,
            currentX: 0,
            sliderSize: 1,
            dragging: false,
            startPosition: 0,
            newPosition: 0,
            offset: 0,
            position: 0

        }
        this.handleDotChange = this.handleDotChange.bind(this);
        this.setState({
            value: this.props.value,
        });
    }
    render() {
        return (
            <div className="slider-warp">
                <div className="time-cur">{this.state.value}</div>
                <div className="progress-bar" ref={(slider => { this.sliderRef = slider })}>
                    <div className="progress-load"></div>
                    <div className="progress-play progress-range" style={{ width: this.state.offset + 'px' }}></div>
                    <div ref={(point) => { this.pointRef = point }} className="progress-point progress-handle"
                        style={{ left: this.state.offset + 'px' }}
                        onClick={this.handleDotChange}
                        onMouseEnter={this.handleMouseEnter.bind(this)}
                        onMouseLeave={this.handleMouseLeave.bind(this)}
                        onMouseDown={this.onButtonDown.bind(this)}></div>
                </div>
                <div className="time-dur">{this.props.max}</div>
            </div>
        )
    }
    handleDotChange() {

    }
    handleDragStart(event) {
        this.setState({
            dragging: true,
            sliderSize: this.sliderRef.clientWidth,
            startX: event.clientX,
            offset: this.state.value * this.sliderRef.clientWidth,
            position: this.state.value * this.sliderRef.clientWidth + this.pointRef.clientWidth / 2,
        });
    }
    handleDraging(event) {
        const { dragging, startX, sliderSize, position } = this.state;
        if (!dragging) return
        const diff = event.clientX - startX
        this.setState({
            offset: diff + position,
        })
        const value = this.state.offset / sliderSize
        this.setState({
            value: value
        })
    }
    handleDragEnd() {
        const { dragging, offset } = this.state;
        if (!dragging) return
        this.setState({
            dragging: false,
            offset
        });
        window.removeEventListener('mousemove', this.handleDraging.bind(this));
        window.removeEventListener('mouseup', this.handleDragEnd.bind(this));
        window.removeEventListener('contextmenu', this.handleDragEnd.bind(this));

    }

    handleMouseEnter() {
        this.setState({
            hovering: true
        });
    }

    handleMouseLeave() {
        this.setState({
            hovering: false
        });
    }

    onButtonDown(event) {
        this.handleDragStart(event);
        window.addEventListener('mousemove', this.handleDraging.bind(this));
        window.addEventListener('mouseup', this.handleDragEnd.bind(this));
        window.addEventListener('contextmenu', this.handleDragEnd.bind(this));
    }


}
Slider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func,
}
Slider.defaultProps = {
    min: 0,
    max: 100,
    value: 0,
    onChange: () => {
    }
}