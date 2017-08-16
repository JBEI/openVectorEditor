// safe edit has found features that will be deleted
// present features to user and ask to select an option:
// - turn safe edit off (and delete)
// - leave safe edit on but still delete
// - cancel deletion
// if deletion proceeds the entire feature is removed

export default function selectSafeFeatures({input, state, output}) {
    var { foundFeatures } = input; // list of affected features
    // put the features in the state tree and open modal
    state.set('featuresToDelete', foundFeatures);
    state.set('showSafeEditModal', 'true');
}