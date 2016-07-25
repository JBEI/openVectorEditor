export default function createSelectionShiftClick({input: {
    nearestBP, caretPosition
}, state, output}) {
    if (nearestBP === caretPosition) {
        return output.doNothing()
    }
    if (nearestBP > caretPosition) {
        output.updateSelection({
            selectionLayer: {
                start: caretPosition,
                end: nearestBP - 1,
                cursorAtEnd: true,
                selected: true
            }
        })
    } else {
        output.updateSelection({
            selectionLayer: {
                start: nearestBP,
                end: caretPosition - 1,
                cursorAtEnd: false,
                selected: true
            }
        })
    }
}
createSelectionShiftClick.outputs = ['updateSelection', 'doNothing'];