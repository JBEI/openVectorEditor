import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

export default class RailFeature extends React.Component {

    render() {
        var {
            feature,
            height
        } = this.props;

        var {
            start,
            end,
            color
        } = feature;

        const pointitude = 100;
        const width = Math.max(end - start, pointitude);
        const tail = width - pointitude > pointitude;
        const flip = {
            toString: () => {
                if (!feature.forward) return `translate(${width}, 0) scale(-1,1)`;

                return '';
            }
        };

        return (
            <g>
                <path
                    d={`M 0, 0
                        L ${width - pointitude}, 0
                        L ${width}, ${height/2}
                        L ${width - pointitude}, ${height}
                        L 0, ${height}
                        L ${(tail) ? pointitude : 0}, ${height/2}
                        Z`}
                    fill={color}
                    stroke={'black'}
                    strokeWidth={'.25px'}
                    vectorEffect={'non-scaling-stroke'}
                    style={{vectorEffect: 'non-scaling-stroke'}}
                    transform={`translate(${start}, 0) ${flip}`}
                />
            </g>
        );
    }

}