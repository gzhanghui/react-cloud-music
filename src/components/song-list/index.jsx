import React, { Component } from "react";
import PropTypes from 'prop-types'
import Immutable from 'immutable'
class SongList extends Component {
    constructor(props) {
        super(props)
        this.selectedItem = this.selectedItem.bind(this)
    }
    selectedItem(item) {
        this.props.onSelectedItem(item)
    }
    render() {
        const list = this.props.list
        return <div className="list">

            <table className="list-warp">
                <tbody>
                    {list.map((item, index) => {
                        return (<tr className="list-item" key={index} onClick={() => { this.selectedItem(item) }}>
                            <td className="cell">{item.name}</td>
                            <td className="cell">{item.artists}</td>
                            <td className="cell">{item.album}</td>
                            <td className="cell">{item.duration}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    }

}

SongList.propTypes = {
    list: PropTypes.oneOfType([PropTypes.arrayOf(Immutable.List, PropTypes.array), PropTypes.object]),
    onSelectedItem: PropTypes.func
}

export default SongList