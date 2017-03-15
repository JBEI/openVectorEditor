import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

export default class RailFeature extends React.Component {

    render() {
        var {
            feature,
            height,
            offset,
            sequenceLength,
            baseWidth,
            signals
        } = this.props;

        var {
            start,
            end,
            color,
            name
        } = feature;

        function transform(value) {
            return baseWidth / sequenceLength * value;
        }

        start = transform(start);
        end = transform(end);
        const maxArrowSlope = transform( 100 );
        const width = end - start;
        const arrowSlope = Math.min(width, maxArrowSlope);
        const flip = () => {
                if (!feature.forward) return `translate(${width}, 0) scale(-1,1)`;

                return '';
            };

        return (
            <g transform={`translate(${start}, ${offset})`}>
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
                    transform={`${flip()}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        signals.featureClicked({annotation: feature})
                    }}
                />
            </g>
        );
    }

}
