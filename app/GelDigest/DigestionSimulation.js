import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import SelectedEnzymes from './SelectedEnzymes';
import EnzymesLists from './EnzymesLists';
import Ladder from './Ladder';

const Dialog = require('material-ui/lib/dialog');

@Cerebral({
    showGelDigestDialog: ['showGelDigestDialog'],
    originalUserEnzymesList: ['originalUserEnzymesList'],
    currentUserEnzymesList: ['currentUserEnzymesList'],
    cancelButtonValue: ['cancelButtonValue'],
    okButtonValue: ['okButtonValue'],
})

export default class DigestionSimulation extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        open: false,
    };

    render () {
        var {
            signals,
            cancelButtonValue,
            okButtonValue,
        } = this.props;

        var toOpen = this.props.showGelDigestDialog;

        var actions = [
            <FlatButton
                label={cancelButtonValue}
                onTouchTap={function() {
                    signals.gelDigestDisplay();
                }}
            />,
            <FlatButton
                label={okButtonValue}
                style={{color: "#03A9F4"}}
                onTouchTap={function() {
                    signals.gelDigestDisplay();
                }}
            />,
        ];

        var customDialogContentStyle = {
            width: '90%',
            height: '700px',
            maxWidth: 'none',
            maxHeight: 'none',
        };

        var paperBlockStyle = {
            width: "99%",
            height: "500px"
        };

        var gridTileTitleStyle = {
            textAlign: "center",
            color: "black",
            opacity: "0.54",
        };

        var tileLeft = (
            <Paper style={paperBlockStyle}>
                <br/><br/><br/><EnzymesLists/>
            </Paper>
        );

        var tileCenter = (
            <Paper style={paperBlockStyle}>
                <br/><br/><br/><SelectedEnzymes/>
            </Paper>
        );

        var tileRight = (
            <Paper style={paperBlockStyle}>
                <br/><br/><br/><Ladder/>
            </Paper>
        );

        var leftTileTitle = (
            <h4 style={gridTileTitleStyle}>Enzymes</h4>
        );

        var centerTileTitle = (
            <h4 style={gridTileTitleStyle}>Active enzymes</h4>
        );

        var rightTileTitle = (
            <h4 style={gridTileTitleStyle}>Ladder</h4>
        );

        var gelDigestContentGrid = (
            <div>
                <GridList
                    cols={3}
                    cellHeight={700}
                    padding={5}
                >
                    <GridTile rows={1} cols={1} title={leftTileTitle} titlePosition={"top"} titleBackground="#E0E0E0">
                        {tileLeft}
                    </GridTile>
                    <GridTile rows={1} cols={1} title={centerTileTitle} titlePosition={"top"} titleBackground="#E0E0E0">
                        {tileCenter}
                    </GridTile>
                    <GridTile rows={1} cols={1} title={rightTileTitle} titlePosition={"top"} titleBackground="#E0E0E0">
                        {tileRight}
                    </GridTile>
                </GridList>
            </div>
        );

        return (
            <div>
                <Dialog
                    ref="gelDigest"
                    title="Gel Digest"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={toOpen}
                    titleStyle={{color: "white", background: "#3F51B5", paddingBottom: "8px", paddingTop: "8px"}}
                    contentStyle={customDialogContentStyle}
                >
                    {gelDigestContentGrid}
                </Dialog>
            </div>
        );
    }

}