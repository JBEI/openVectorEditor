import React from 'react';
import RailFeature from './RailFeature';
import IntervalTree from 'interval-tree2';

import getYOffset from './getYOffset';

export default function Features(features = [], annotationHeight, spaceBetweenAnnotations = 2, sequenceLength, signals) {

    var svgGroups = [];
    var featureITree = new IntervalTree(sequenceLength / 2);
    var maxYOffset = 0;
    var fontWidth = 4;
    var fontHeight = fontWidth * 1.5;
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

        let label = {text: feature.name, x: feature.start};
        let cache = [];
        while (labels.length > 0 && labels[0].x > label.x) cache.push(labels.shift());
        cache.push(label)
        labels = cache.concat(labels);
    });

    function transform(value) {
        return baseWidth / sequenceLength * value;
    }

    var labelComponents = [];
    for (let i = 0; i < labels.length/2; i++) {
        let labelA = labels[i];
        let labelB = labels[labels.length - 1 - i];
        labelComponents.push(<text style={{fontSize: fontWidth}} x={transform( labelA.x )} y={-i * fontWidth}>{labelA.text}</text>);
        labelComponents.push(<text style={{fontSize: fontWidth, textAnchor: 'end'}} x={transform( labelB.x )} y={-i * fontWidth}>{labelB.text}</text>);
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
        labelComponents
    };

}
