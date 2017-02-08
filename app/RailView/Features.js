import React from 'react';
import RailFeature from './RailFeature';
import IntervalTree from 'interval-tree2';

import getYOffset from './getYOffset';

export default function Features(features = [], annotationHeight, spaceBetweenAnnotations = 2, sequenceLength, signals) {

    var svgGroups = [];
    var featureITree = new IntervalTree(sequenceLength / 2);
    var maxYOffset = 0;

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
    });

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
        height: totalAnnotationHeight
    };

}
