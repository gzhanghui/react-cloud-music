import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames';
import './style.less'

export default class Card extends React.Component {


    render() {
        const { header, children, headerClassName, extra } = this.props;
        return (
            <div className={classNames(`card ${headerClassName || ''}`)}>
                {header && <div className="card-header">
                    <span className='card-header-title'> {header}</span>
                    <div className='card-header-extra'>{extra && extra}</div>
                </div>}
                <div className="card-body">
                    {children}
                </div>
            </div>
        )
    }
}

Card.propTypes = {
    header: PropTypes.node,
    headerClassName: PropTypes.string,
    extra: PropTypes.node,
    children: PropTypes.node,
};