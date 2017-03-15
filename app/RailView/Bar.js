import React from 'react';

export default class Bar extends React.Component {

    render() {
        var {
            baseWidth
        } = this.props;

        return (
            <g>
                <path
                    d={`M 0, 0 L ${baseWidth}, 0 L ${baseWidth}, 4 L 0, 4 Z`}
                    fill={'#ffff99'}
                    stroke={'black'}
                    strokeWidth={'.25px'}
                    vectorEffect={'non-scaling-stroke'}
                    style={{vectorEffect: 'non-scaling-stroke'}}
                />
            </g>
        );
    }

}
