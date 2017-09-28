import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import ToolBar from './ToolBar';
import StatusBar from './StatusBar';
import SideBar from './SideBar';
import Clipboard from './Clipboard';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IconButton from 'material-ui/lib/icon-button';
import styles from './sequence-editor.css';

var assign = require('lodash/object/assign');
var bindGlobalPlugin = require('combokeys/plugins/global-bind');
var CircularView = require('./CircularView/CircularView');
var Combokeys = require("combokeys");
var RowView = require('./RowView/RowView');
var combokeys;

@Cerebral({
    bpsPerRow: ['bpsPerRow'],
    caretPosition: ['caretPosition'],
    clipboardData: ['clipboardData'],
    cutsites: ['cutsites'],
    cutsitesByName: ['cutsitesByName'],
    embedded: ['embedded'],
    history: ['history'],
    historyIdx: ['historyIdx'],
    newRandomRowToJumpTo: ['newRandomRowToJumpTo'],
    orfs: ['orfs'],
    readOnly: ['readOnly'],
    savedIdx: ['savedIdx'],
    selectedSequenceString: ['selectedSequenceString'],
    searchLayers: ['searchLayers'],
    selectionLayer: ['selectionLayer'],
    sequenceData: ['sequenceData'],
    sequenceLength: ['sequenceLength'],
    showCircular: ['showCircular'],
    showRow: ['showRow'],
    showSearchBar: ['showSearchBar'],
    showSidebar: ['showSidebar'],
    sidebarType: ['sidebarType'],
    totalRows: ['totalRows']
})

export default class SequenceEditor extends React.Component {

    warn(e) {
        var confirmationMessage = "Are you sure you want to leave this page without placing the order ?";
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }

    componentWillMount() {
        // trying to fix cross origin problem
        this.props.sequenceData.features.forEach(function(feature) {
            if (!feature.end || feature.end === 0) {
                this.props.signals.updateFeature({ feature: feature, reset: true });
            }
        }.bind(this));
        this.props.signals.updateHistory({ newHistory: this.props.sequenceData });
    }

    componentDidMount() {
        var {
            backspacePressed,
            caretMoved,
            copySelection,
            cutSelection,
            pasteSequenceString,
            selectAll,
            selectInverse,
            sequenceDataInserted,
            updateHistory,
        } = this.props.signals;

        combokeys = new Combokeys(document.documentElement);
        bindGlobalPlugin(combokeys);

        //bind a bunch of keyboard shortcuts we're interested in catching
        combokeys.bind(['a', 'b', 'c', 'd', 'g', 'h', 'k', 'm', 'n', 'r', 's', 't', 'v', 'w', 'y'], function(event) { // type in bases
            sequenceDataInserted({newSequenceData: {sequence: String.fromCharCode(event.charCode)}});
        });
        combokeys.bind(['left','shift+left'] , function(event) { // Handle shortcut
            caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretLeftOne'});
        });
        combokeys.bind(['right','shift+right'] , function(event) { // Handle shortcut
            caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretRightOne'});
        });
        combokeys.bind(['up','shift+up'] , function(event) { // Handle shortcut
            caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretUpARow'});
        });
        combokeys.bindGlobal(['down','shift+down'] , function(event) { // Handle shortcut
            caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretDownARow'});
        });
        combokeys.bindGlobal(['mod+right','mod+shift+right'], function(event) { // Handle shortcut
            caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToEndOfRow'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+left','mod+shift+left'], function(event) { // Handle shortcut
            caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToStartOfRow'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+up','mod+shift+up'], function(event) { // Handle shortcut
            caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToStartOfSequence'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+down','mod+shift+down'], function(event) { // Handle shortcut
            caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToEndOfSequence'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bind('backspace', function(event) { // Handle shortcut
            backspacePressed();
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal('command+a', function(event) { // Handle shortcut
            selectAll();
            event.preventDefault();
            event.stopPropagation();
        });
        combokeys.bindGlobal('command+ctrl+i', function(event) { // Handle shortcut
            selectInverse();
            event.stopPropagation();
        });
        combokeys.bindGlobal('command+z', function(event) { // Handle shortcut
            updateHistory({ idx: -1 });
            event.preventDefault();
            event.stopPropagation();
        });
        combokeys.bindGlobal('command+y', function(event) { // Handle shortcut
            updateHistory({ idx: 1 });
            event.preventDefault();
            event.stopPropagation();
        });
        combokeys.bindGlobal('command+c', function(event) { // Handle shortcut
            event.preventDefault();
            copySelection();
            // event.stopPropagation();
        });
        combokeys.bindGlobal('command+x', function(event) { // Handle shortcut
            cutSelection();
            event.stopPropagation();
        });
        // no paste, that's handled by the clipboard component only
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.sequenceData !== prevProps.sequenceData) {
            this.props.signals.updateHistory({ newHistory: this.props.sequenceData });
        }

        // warns if you try to leave page with unsaved changes
        // ** doesn't work in firefox
        if (this.props.savedIdx !== this.props.historyIdx) {
            window.addEventListener("beforeunload", this.warn);
        } else {
            window.removeEventListener("beforeunload", this.warn);
        }
    }

    openAddFeatureDisplay() {
        this.setState({ editFeature: -1, selectedFeatures: [] });
        this.props.signals.addFeatureModalDisplay();
        this.props.signals.sidebarToggle({ sidebar: true });
        this.props.signals.adjustWidth();
    }

    render() {
        var {
            clipboardData,
            cutsites,
            embedded,
            orfs,
            readOnly,
            selectedSequenceString,
            selectionLayer,
            sequenceData,
            showCircular,
            showRow,
            showSearchBar,
            showSidebar,
            sidebarType
        } = this.props;

        console.log(sequenceData.features)

        var table;
        var sidebarStyle = {};
        // we need this position relative to place the controller bar in the sidebar
        Object.assign(sidebarStyle, {minWidth: '580px', overflow: 'hidden', borderRight: '1px solid #ccc', position: 'relative'}, (showSidebar) ? {} : {display: 'none'})

        // add feature button that appears outside of sidebar when there's a selectionLayer
        var addFeatureButton = <div></div>;
        if (!showSidebar && selectionLayer.start > 0 && !selectionLayer.id && !readOnly) {
            addFeatureButton =
                <IconButton
                    style={{position:'absolute', bottom:'115px', left:'5px', zIndex:'500', backgroundColor:'rgba(255,255,255,0.5)'}}
                    onTouchTap={this.openAddFeatureDisplay.bind(this)}
                    tooltip="add feature"
                    tooltipPosition="top-center">
                    <AddBoxIcon />
                </IconButton>
        }

        // check if we have just circ or just row and pad it out a little
        // using the bitwise xor here might be a little sketchy
        var oneViewOnly = !showSidebar && (showCircular ^ showRow)
        var circularStyle = {}
        if(!showCircular) circularStyle = {display: 'none'}
        var rowStyle = {}
        if(!showRow) rowStyle = {display: 'none'}


        var borderStyle = 'none';
        if (showSearchBar) {
            borderStyle = '1px solid rgb(232,232,232)';
        }
        // this should probably move to the sidebar file
        if (sidebarType === 'Features') {
            table = (
                <SideBar
                    openAddFeatureDisplay={this.openAddFeatureDisplay}
                    annotations={sequenceData.features}
                    annotationType={sidebarType}
                    />
            );
        } else if (sidebarType === 'Cutsites') {
            table = (
                <SideBar
                    openAddFeatureDisplay={this.openAddFeatureDisplay}
                    annotations={cutsites}
                    annotationType={sidebarType}
                    />
            );
        } else if (sidebarType === 'Orfs') {
            table = (
                <SideBar
                   annotations={orfs}
                   annotationType={sidebarType}
                   />
            );
        }

        var toolbarStyle = '0px';
        if (showSearchBar) {
            toolbarStyle = '60px';
        }

        return (
            <div ref="sequenceEditor" className={styles.app}>

                <Clipboard />

                <div className={styles.head} style={{marginBottom: toolbarStyle}}>
                    <ToolBar />
                </div>

                <div className={styles.content} id="allViews" style={{borderTop: borderStyle}}>
                    <div className={styles.sideBarSlot} id="sideBar" style={ sidebarStyle }>
                      {table}
                    </div>

                    { addFeatureButton }

                    <div className={styles.circularViewSlot} id="circularView" style={ circularStyle }>
                        <CircularView showCircular={showCircular}/>
                    </div>
                    <div className={styles.rowViewSlot} id="rowView" style={ rowStyle }>
                        <RowView showRow={showRow} sequenceData={sequenceData} />
                    </div>
                </div>

                <div className={styles.foot}>
                    <StatusBar />
                </div>
            </div>
        );
    }
}
