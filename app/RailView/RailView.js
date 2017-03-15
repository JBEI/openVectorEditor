import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import Draggable from 'react-draggable';
import styles from './RailView.scss';
import Caret from './Caret';
import Bar from './Bar';
import Features from './Features';

@Cerebral({
    sequenceLength: ['sequenceLength'],
    sequenceData: ['sequenceData'],
    selectionLayer: ['selectionLayer'],
    showAxis: ['showAxis'],
    showFeatures: ['showFeatures'],
    textWidth: ['textWidth']
})
export default class RailView extends React.Component {

    getNearestCursorPositionToMouseEvent(event, sequenceLength, callback) {
        var {
            rail
        } = this.refs;

        var boundingRect = rail.getBoundingClientRect();
        var clickX = event.clientX - boundingRect.left;
        clickX = Math.max(0, clickX);
        clickX = Math.min(boundingRect.width, clickX);
        var nearestBP = Math.floor(sequenceLength / boundingRect.width * clickX) + 1; // base pairs are not zero indexed

        callback({
            shiftHeld: event.shiftKey,
            nearestBP,
            caretGrabbed: false
        });
    }

    render() {
        var {
            sequenceLength,
            sequenceData,
            selectionLayer,
            showAxis,
            showFeatures,
            textWidth,
            signals
        } = this.props;

        var annotationsSvgs = [];
        var selectionSVGs = [];
        var labels = [];
        const baseWidth = 250;
        const annotationHeight = 4;
        const spaceBetweenAnnotations = 2;

        if (showFeatures) {
            var featureResults = Features(
                sequenceData.features,
                annotationHeight,
                spaceBetweenAnnotations,
                baseWidth,
                sequenceLength,
                signals
            );

            labels = featureResults.labelComponents;
            annotationsSvgs.push(featureResults.component);
        }

        if (selectionLayer && selectionLayer.selected) {
            let {
                start,
                end
            } = selectionLayer;

            let height = 4;

            if (featureResults && featureResults.height) {
                height += featureResults.height
            }

            selectionSVGs.push(
                <path
                    transform={`scale(${ baseWidth / sequenceLength }, 1) translate(${ baseWidth / sequenceLength }, 0)`}
                    style={{opacity: .4, pointerEvents: 'none'}}
                    d={`M ${start}, 0 L ${end}, 0 L ${end}, ${height} L ${start}, ${height} Z`}
                    fill={'blue'}
                />
            );

            selectionSVGs.push(
                <Caret
                    key='caretStart'
                    caretPosition={start}
                    sequenceLength={sequenceLength}
                    height={height}
                    />
            );
            selectionSVGs.push(
                <Caret
                    key='caretEnd'
                    caretPosition={end + 1}
                    sequenceLength={sequenceLength}
                    height={height}
                    />
            );
        }

        return (
            <Draggable
                bounds={{top: 0, left: 0, right: 0, bottom: 0}}
                onDrag={(event) => {
                        this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorDragged)
                    }}
                onStart={(event) => {
                        this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorDragStarted)
                    }}
                onStop={signals.editorDragStopped}
                >
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

                    <g ref={'rail'} transform={`translate(-${baseWidth / 2}, 0) `}>
                        <g>
                            { selectionSVGs }
                        </g>
                        {showAxis && <Bar baseWidth={baseWidth} />}
                        <g>
                            { annotationsSvgs }
                        </g>
                        <g>
                            { labels }
                        </g>
                    </g>
                </svg>
            </Draggable>
        );
    }

}
