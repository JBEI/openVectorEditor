import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

export default class RailFeature extends React.Component {

    render() {
        var {
            feature,
            height,
            signals
        } = this.props;

        var {
            start,
            end,
            color
        } = feature;

        const arrowSlope = 100;
        const width = Math.max(end - start, arrowSlope);
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
                        L ${width - arrowSlope}, 0
                        L ${width}, ${height/2}
                        L ${width - arrowSlope}, ${height}
                        L 0, ${height}
                        Z`}
                    fill={color}
                    stroke={'black'}
                    strokeWidth={'.25px'}
                    vectorEffect={'non-scaling-stroke'}
                    style={{vectorEffect: 'non-scaling-stroke'}}
                    transform={`translate(${start}, 0) ${flip}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        signals.featureClicked({annotation: feature})
                    }}
                />
            </g>
        );
    }

}
