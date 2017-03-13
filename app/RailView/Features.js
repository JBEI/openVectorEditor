import React from 'react';
import RailFeature from './RailFeature';
import IntervalTree from 'interval-tree2';

import getYOffset from './getYOffset';

export default function Features(features = [], annotationHeight, spaceBetweenAnnotations = 2, sequenceLength, signals) {

    var svgGroups = [];
    var featureITree = new IntervalTree(sequenceLength / 2);
    var maxYOffset = 0;
    var names = [];
    var labels = [];

    features.forEach((feature, index) => {
        let {
            start,
            end
        } = feature;

        let length = end - start;

        if (start > end) {
            return;
        }

        let offset = getYOffset(featureITree, start, end);
        maxYOffset = Math.max(maxYOffset, offset);
        featureITree.add(start, end, null, {...feature, yOffset: offset});

        offset *= annotationHeight + spaceBetweenAnnotations;

        svgGroups.push(
            <RailFeature
                id={feature.id}
                key={'features' + (length - index)}
                feature={feature}
                height={annotationHeight}
                offset={offset}
                signals={signals}
            />
        );

        names.push({ name: feature.name, x: feature.start });
    });

    for (let i = 0; i < names.length / 2; i++) {
        labels.push(<text x={names[names.length - 1 - i].x} y={i * 10}>{names[names.length - 1 - i]}</text>)
        labels.push(<text x={names[i].x} y={i * 10}>{names[i]}</text>)
    }

    var totalAnnotationHeight = maxYOffset * (annotationHeight * spaceBetweenAnnotations);

    return {
        component: (
            <g
                key={'veFeatures'}
                transform={`translate(0, ${annotationHeight + spaceBetweenAnnotations})`}
            >
                { svgGroups }
            </g>
        ),
        height: totalAnnotationHeight,
        labels
    };

}
