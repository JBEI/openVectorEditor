import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import styles from './RailView.scss';
import Caret from './Caret';
import Bar from './Bar';
import Features from './Features';

@Cerebral({
    sequenceLength: ['sequenceLength'],
    sequenceData: ['sequenceData'],
    selectionLayer: ['selectionLayer'],
    showAxis: ['showAxis'],
    showFeatures: ['showFeatures']
})
export default class RailView extends React.Component {

    render() {
        var {
            sequenceLength,
            sequenceData,
            selectionLayer,
            showAxis,
            showFeatures,
            signals
        } = this.props;

        var annotationsSvgs = [];
        var labels = [];
        const baseWidth = 250;
        const annotationHeight = 4;
        const spaceBetweenAnnotations = 2;

        if (showAxis) {
            annotationsSvgs.push(<Bar baseWidth={baseWidth} />);
        }

        if (showFeatures) {
            var featureResults = Features(
                sequenceData.features,
                annotationHeight,
                spaceBetweenAnnotations,
                sequenceLength,
                signals
            );

            labels = featureResults.labels;
            annotationsSvgs.push(featureResults.component);
        }

        if (selectionLayer && selectionLayer.selected) {
            let {
                start,
                end
            } = selectionLayer;

            let height = 8;

            if (featureResults && featureResults.height) {
                height = featureResults.height
            }

            annotationsSvgs.push(
                <path
                    style={{opacity: .4}}
                    d={`M ${start}, 0 L ${end}, 0 L ${end}, ${height} L ${start}, ${height} Z`}
                    fill={'blue'}
                />
            );

            annotationsSvgs.push(
                <Caret
                    key='caretStart'
                    caretPosition={start}
                    sequenceLength={sequenceLength}
                    height={height}
                    />
            );
            annotationsSvgs.push(
                <Caret
                    key='caretEnd'
                    caretPosition={end + 1}
                    sequenceLength={sequenceLength}
                    height={height}
                    />
            );
        }

        return (
            <svg
                className={styles.svg}
                viewBox={'-150 -150 300 300'}
                preserveAspectRatio={'xMidYMid meet'}
            >
                <marker id="codon" markerWidth="3" markerHeight="3" refx="0" refy="3" orient="auto">
                    <circle fill="red" cx="0" cy="0" r="2"/>
                </marker>
                <marker id="arrow" markerWidth="3" markerHeight="3" refx="0" refy="3" orient="auto">
                    <path
                        d="M 0 0 L 0 6 L 9 150 L 200 50"
                        stroke="red"
                        strokeWidth="3"
                        fill="none"
                        />
                </marker>

                <g transform={`translate(-${baseWidth / 2}, 0) `}>
                    <g>
                        { labels }
                    </g>
                    <g transform={`scale(${baseWidth / sequenceLength}, 1)`}>
                        { annotationsSvgs }
                    </g>
                </g>
            </svg>
        );
    }

}
