// when safeEdit is on, check selected sequence for features that will be affected, present to user
// for further input. If no features are found we'll just delete sequence as usual.

export default function presentFeatures({input, state, output}) {
    var selectionLayer = state.get('selectionLayer');
    // are there features in the selection range?
    var featuresPresent = [];

    function isFeatureInRange(range, feature) {
        // feature and range are tuples of (start, end)
        // return Boolean
        var inRange = false;
        // case: start and end are outside spanning range => T
        if(feature[0] < range[0] && range[1] < feature[1])
            inRange = true;
        // case: start or end is in range => T includes case where start & end inside (inclusive)
        else if((feature[0] >= range[0] && feature[0] <= range[1]) 
                || (feature[1] >= range[0] && feature[1] <= range[1]))
            inRange = true;
        return inRange;
    }

    function findFeaturesInRange(rangeStart, rangeEnd) {
        var featuresInSeq = state.get('sequenceData.features');
        var feature;
        for(var i = 0; i < featuresInSeq.length; i++) {
            feature = featuresInSeq[i]
            if(isFeatureInRange([rangeStart, rangeEnd], [feature.start, feature.end])) {
                featuresPresent.push(feature)
            } // else skip it
        }
    };

    // this function is a mutator of featuresPresent
    findFeaturesInRange(selectionLayer.start, selectionLayer.end);

    if (featuresPresent.length > 0) {
        output.foundFeatures({'inRangeFeatures': featuresPresent});
    } else {
        output.noFeatures();
    };
}

presentFeatures.outputs = ['foundFeatures', 'noFeatures'];