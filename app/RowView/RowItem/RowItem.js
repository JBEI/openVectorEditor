/* structure of row object

obj
    - cutsites[]
        - length: number
        Object:
        - annotation [object of type]
        - enclosingRangeType : string
        - end : number
        - id : ?
        - start : number
        - yOffset : number
    - end : number
    - features[]
    - orfs []
    - parts [] // unused by us
    - rowNumber : number
    - sequence : string
    - start : number
    - translations []
*/

// import PassThrough from '../../utils/PassThrough'
import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString'
import React from 'react';
import Draggable from 'react-draggable'
import { Decorator as Cerebral } from 'cerebral-view-react';
import { columnizeString, elementWidth, calculateRowLength } from '../utils';
// import SelectionLayer from './SelectionLayer';
import _Sequence from './Sequence'
// import LineageLines from './LineageLines'
// import _Axis from './Axis'
// import _Orfs from './Orfs'
// import _Translations from './Translations'
import _Features from './Features'
// import _CutsiteLabels from './CutsiteLabels'
// import _Cutsites from './Cutsites'
// import Caret from './Caret'
import styles from './RowItem.scss';

function noop() {

}

@Cerebral({
    annotationHeight: ['annotationHeight'],
    bpsPerRow: ['bpsPerRow'],
    caretPosition: ['caretPosition'],     
    charWidth: ['charWidth'], 
    circularAndLinearTickSpacing: ['circularAndLinearTickSpacing'],    
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],         
    cutsites: ['cutsites'],
    orfs: ['orfData'],
    rowData: ['rowData'],
    selectionLayer: ['selectionLayer'],
    sequenceData: ['sequenceData'],
    sequenceLength: ['sequenceLength'],
    sequenceName: ['sequenceData', 'name'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCaret: ['showCaret'],
    showSequence: ['showSequence'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations']     
})

class RowItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    getMaxSequenceLength(charWidth, columnWidth) {
        var sequenceWidthPx = elementWidth(this.refs.sequenceContainer);
        return calculateRowLength(charWidth, sequenceWidthPx, columnWidth);
    }

    _resizeSVG() {
        var {
            sequenceContainer: svg
        } = this.refs;

        var bbox = svg.getBBox();
        svg.setAttribute('height', bbox.y + bbox.height + 'px');
    }

    componentDidMount() {
        this._resizeSVG();
    }

    componentDidUpdate() {
        this._resizeSVG();
    }

    _processProps(props) {
        var {
            sequenceData,
            columnWidth
        } = props;

        var {
            sequence,
            offset,
            className
        } = sequenceData;

        var complement = getComplementSequenceString(sequence);

        var renderedSequence = columnizeString(sequence, columnWidth);
        var renderedComplement = columnizeString(complement, columnWidth);

        this.setState({
            renderedSequence: renderedSequence,
            renderedComplement: renderedComplement,
            renderedOffset: (offset || 0) + 1
        });
    }

    componentWillMount() {
        this._processProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this._processProps(nextProps);
    }

    render() {
        var {
            charWidth,
            selectionLayer,
            searchLayers,
            sequenceData,
            cutsiteLabelSelectionLayer,
            annotationHeight,
            tickSpacing,
            showCutsites,
            showReverseSequence,
            sequenceHeight,
            spaceBetweenAnnotations,
            width,
            additionalSelectionLayers,
            caretPosition,
            sequenceLength,
            row,
            showFeatures,
            bpsPerRow,
            componentOverrides = {},
            className
        } = this.props;

        var {
            renderedSequence,
            renderedComplement,
            renderedOffset
        } = this.state;
        
        var {
            sequence='',
            features= [],
            translations= [],
            cutsites= [],
            orfs= []
        } = row

        var reverseSequence = getComplementSequenceString(sequence)

        if (!row) {
            return null;
        }

        var {
            Sequence = _Sequence,
        //     Axis = _Axis,
        //     Orfs = _Orfs,
        //     Translations = _Translations,
            Features = _Features,
        //     CutsiteLabels = _CutsiteLabels,
        //     Cutsites = _Cutsites,
        //     // Caret = _Caret,
        } = componentOverrides

        var annotationCommonProps = {
          charWidth,
          bpsPerRow,
          sequenceLength,
          annotationHeight,
          spaceBetweenAnnotations,
          row
        }
        
        return (

            <div className = {styles.rowItem + "veRowItem"}>
                <div className={styles.margin}>
                    {renderedOffset}
                </div>

                {(showFeatures && Object.keys(features).length > 0) &&
                    <Features
                        annotationRanges={features}
                        {...annotationCommonProps}
                        />
                }

                <div className='veRowItemSequenceContainer'>
                    <Sequence
                        sequence={sequence}
                        height={1}
                        length={sequence.length}
                        charWidth={charWidth}
                        >
                    </Sequence>

                    {showReverseSequence &&
                        <Sequence
                            length={sequence.length}
                            sequence={reverseSequence}
                            height={1}
                            charWidth={charWidth}>
                        </Sequence>
                    }
                </div>
              
            </div>
        );
    }
}

module.exports = RowItem;