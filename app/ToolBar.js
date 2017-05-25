// React
import React, { PropTypes } from 'react';

// Cerebral
import { Decorator as Cerebral } from 'cerebral-view-react';
import RestrictionEnzymeManager from './RestrictionEnzymeManager/RestrictionEnzymeManager';
import DigestionSimulation from './GelDigest/DigestionSimulation';

// Material UI
import BothViewsIcon from 'material-ui/lib/svg-icons/av/art-track';
import EnzymesIcon from 'material-ui/lib/svg-icons/action/track-changes';
import CircularIcon from 'material-ui/lib/svg-icons/device/data-usage';
import Dialog from 'material-ui/lib/dialog';
import DownloadIcon from 'material-ui/lib/svg-icons/file/file-download';
import FileIcon from 'material-ui/lib/svg-icons/editor/insert-drive-file';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import InputIcon from 'material-ui/lib/svg-icons/action/input';
import MenuItem from 'material-ui/lib/menus/menu-item';
import PrintIcon from 'material-ui/lib/svg-icons/action/print';
import RailIcon from 'material-ui/lib/svg-icons/hardware/power-input';
import RaisedButton from 'material-ui/lib/raised-button';
import RowIcon from 'material-ui/lib/svg-icons/content/text-format';
import SaveIcon from 'material-ui/lib/svg-icons/action/backup';
import SearchIcon from 'material-ui/lib/svg-icons/action/search';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import UploadIcon from 'material-ui/lib/svg-icons/file/file-upload';

import Search from './Search.js'
import styles from './tool-bar.css'

@Cerebral({
    embedded: ['embedded'],
    readOnly: ['readOnly'],
    showOrfs: ['showOrfs'],
    showCutsites: ['showCutsites'],
    showParts: ['showParts'],
    showFeatures: ['showFeatures'],
    showRow: ['showRow'],
    showTranslations: ['showTranslations'],
    showSidebar: ['showSidebar'],
    history: ['history'],
    historyIdx: ['historyIdx'],
    savedIdx: ['savedIdx']
})

export default class ToolBar extends React.Component {

    render() {
        var {
            embedded,
            readOnly,
            showFeatures,
            showParts,
            showTranslations,
            showOrfs,
            showCutsites,
            showRow,
            showSidebar,
            signals,
            history,
            historyIdx,
            savedIdx
        } = this.props;

        var restrictionDialog = (
            <RestrictionEnzymeManager />
        );

        var gelDialog = (
            <DigestionSimulation />
        );

        // show/hide views buttons that only appear in embedded mode
        var embeddedControls = (
            <div style={{display: 'inline-block'}}>
                <IconButton tooltip="Display Sequence View"
                    onTouchTap={function() {
                        signals.toggleShowCircular({ showCircular: false });
                        signals.toggleShowRow({ showRow: true });
                        signals.adjustWidth();
                    }}
                    >
                    <RowIcon />
                </IconButton>
                { embedded ? null :
                    <IconButton tooltip="Display Side-by-side View"
                        disabled = { (showSidebar) }
                        onTouchTap={function() {
                            signals.toggleShowCircular({ showCircular: true });
                            signals.toggleShowRow({ showRow: true });
                            signals.adjustWidth();
                        }}
                        >
                        <BothViewsIcon />
                    </IconButton>
                }
                <IconButton tooltip="Display Circular View"
                    onTouchTap={function() {
                        signals.toggleShowCircular({ showCircular: true });
                        signals.toggleShowRow({ showRow: false });
                    }}
                    >
                    <CircularIcon />
                </IconButton>
            </div>
        )

        // upload and download files items
        var fileMenuItems = (
            <div>
                <MenuItem key={1} primaryText="Download SBOL 1.1" insetChildren={false}
                    style={{padding:'0 20px'}}
                    onClick={function () {
                        signals.clickSaveFile({fileExt: 'sbol1'});
                    }} />
                <MenuItem key={2} primaryText="Download SBOL 2.0" insetChildren={false}
                    style={{padding:'0 20px'}}
                    onClick={function () {
                        signals.clickSaveFile({fileExt: 'sbol2'});
                    }} />
                <MenuItem key={3} primaryText="Download GenBank" insetChildren={false}
                    style={{padding:'0 20px'}}
                    onClick={function () {
                        signals.clickSaveFile({fileExt: 'genbank'});
                    }} />
                <MenuItem key={4} primaryText="Download Fasta" insetChildren={false}
                    style={{padding:'0 20px'}}
                    onClick={function () {
                        signals.clickSaveFile({fileExt: 'fasta'});
                    }} />
                { embedded ? null :
                    <MenuItem key={5} primaryText="Upload from file ..." insetChildren={false}
                        style={{padding:'0 20px'}}
                        onClick={function () {
                            var element = document.getElementById("uploadFileInput");
                            element.click();
                            element.addEventListener("change", handleFiles, false);
                            function handleFiles() {
                                let file = this.files[0];
                                 signals.clickLoadFile({inputFile: file});
                            }
                        }}
                        />
                }
                <input type="file" id="uploadFileInput" style={{display:'none'}} onChange={function() {
                }} />
            </div>
        );

        var fileButtonElement = (
            <IconButton tooltip="File Functions">
                <FileIcon />
            </IconButton>
        );

        // jsx styling syntax is really screwy!
        var disabledStyle = {opacity: '.5'};
        var toggleStyles = {display: 'inline-block', fontSize: '16px', fontWeight: 'bold', verticalAlign: 'top'}
        var buttonStyles = {position: 'relative', display: 'inline-block', padding: '10px 16px', margin: '6px 10px', border: '1px solid black', borderRadius: '4px'}
        // show or hide features &c
        var toggleFeatures = (
            <div style={ toggleStyles }>
                <div title="Toggle Features" style={ showFeatures ? buttonStyles : Object.assign(disabledStyle, buttonStyles) } id='toggleFeatures' onClick={function () {
                    signals.toggleAnnotationDisplay({type: 'Features'});
                }}> F </div>
                <div title="Toggle Cutsites" style={ showCutsites ? buttonStyles : Object.assign(disabledStyle, buttonStyles) } id='toggleCutsites' onClick={function () {
                    signals.toggleAnnotationDisplay({type: 'Cutsites'});
                }}> C </div>
                <div title="Toggle ORFs" style={ showOrfs ? buttonStyles : Object.assign(disabledStyle, buttonStyles) } id='toggleOrfs' onClick={function () {
                    signals.toggleAnnotationDisplay({type: 'Orfs'});
                }}> O </div>
            </div>
        );

        // pulls out the current view and necessary resizing js to a new tab
        // and applies some styling to cleanup for print version
        var prepPrintPage = function() {
            // scroll the rowview to reveal all rows

            var contents = document.getElementById("allViews").innerHTML;
            var head = document.head.innerHTML;
            var stylePage = "<style>" +
                                "@page {margin: 1in;}" +
                                ".veSelectionLayer {display: none;}" +
                                "#circularView, #rowView {width: 8.5in; display: block; overflow: visible;}" +
                                "#circularView {page-break-after: always;}" +
                                "#rowView > div {bottom: auto;}" +
                            "</style>";
            var printTab = window.open();
            printTab.document.body.innerHTML = head + stylePage + contents;
            printTab.document.close();
            printTab.focus();
            printTab.print();
            printTab.close();
        };

        var saveButtonStatus = "saved";
        if (historyIdx !== savedIdx) {
            saveButtonStatus = "unsaved";
        }

        return (
            <Toolbar>
                <ToolbarGroup key={0}>
                    <IconButton
                        tooltip="Feature Details"
                        onTouchTap={function() {
                            signals.sidebarToggle();
                            signals.adjustWidth();
                        }}
                        >
                        <InputIcon id="openFeatureDisplay"/>
                    </IconButton>

                    { embeddedControls }

                    <IconButton
                        tooltip="Print Current View"
                        onTouchTap={function() {
                            prepPrintPage();
                        }}
                        >
                        <PrintIcon />
                    </IconButton>

                    <IconButton
                        tooltip="Search"
                        onTouchTap={function() {
                            signals.toggleSearchBar();
                        }}>
                        <SearchIcon />
                    </IconButton>

                    <Search />

                    { toggleFeatures }

                    <IconButton
                        disabled={ readOnly }  // you can't save in read only
                        tooltip="Save to Server"
                        className={styles[saveButtonStatus]}
                        onTouchTap={function() {
                            signals.saveChanges();
                        }}
                        >
                        <SaveIcon />
                    </IconButton>

                    <IconMenu iconButtonElement={fileButtonElement} openDirection="bottom-right">
                        {fileMenuItems}
                    </IconMenu>

                    <IconButton
                        label="Dialog"
                        tooltip="Manage Restriction Enzymes"
                        onTouchTap={function() {
                            signals.restrictionEnzymeManagerDisplay();
                        }}
                        >
                        <EnzymesIcon />
                    </IconButton>
                    { restrictionDialog }

                    <IconButton
                        label="Dialog"
                        tooltip="Simulate Digestion"
                        onTouchTap={function() {
                            signals.gelDigestDisplay();
                        }}
                        >
                        <EnzymesIcon />
                    </IconButton>
                    { gelDialog }

                </ToolbarGroup>
            </Toolbar>
        );
    }
}
