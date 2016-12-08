import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import TextField from 'material-ui/lib/text-field';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import assign from 'lodash/object/assign';
import FlatButton from 'material-ui/lib/flat-button';


// {{}} remove this.state and do it correctly

// this is the feature detail popout that comes out of the sidebar; it may need a new name
// or to be in a folder with sidebar stuff. This form is used to edit / add feature information

@Cerebral({
    showAddFeatureModal: ['showAddFeatureModal'],
})

export default class SidebarDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            feature: assign({}, this.props.feature),
            newFeature: {},
            style: {},
        };

        if (this.state.feature.notes === undefined) {
            this.state.feature.notes = [];
        } else {
            this.state.feature.notes = this.props.feature.notes.slice();
        }
        // if (this.props.createFeature != null) {
            this.state.style = {backgroundColor: 'white', position: 'relative', width: '350px', height: '360px', paddingBottom: '10px', overflowY: 'visible'};
        // } else {
            // this.state.style = {padding: '0 20px 40px 20px', borderTop: '1px #999 solid'};
        // }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({feature: assign({}, nextProps.feature)});
    }


    save = () => {
        this.props.editFeature(this.state.feature);
    };

    onChange = (event) => {
        this.state.feature[event.target.id] = event.target.value;
        this.setState({
            feature: this.state.feature,
        });
        if (this.props.createFeature != null) {
            this.props.createFeature(this.state.feature);
        }
    };

    render() {
        var {
            showAddFeatureModal
        } = this.props;

        if (this.props.feature.notes) {
            var saveButton = (
                <FlatButton
                    onTouchTap={this.save}
                    label="Save Changes"
                    style={{color: "#03A9F4", position: 'absolute', top: '360px', left: '90px'}}
                />
            );

        }

        return (
            <div style={this.state.style}>


              <TextField
                 id={"name"}
                 onChange={this.onChange}
                 floatingLabelText={"name"}
                 value={this.state.feature.name.toString()}
                 />

              <br />

              <TextField
                 id={"type"}
                 onChange={this.onChange}
                 floatingLabelText={"type"}
                 value={this.state.feature.type.toString()}
                 />

              <br />

              <TextField
                 id={"start"}
                 onChange={this.onChange}
                 floatingLabelText={"start"}
                 errorText={isNaN(this.state.feature.start) && "not a number"}
                 value={this.state.feature.start.toString()}
                 />

              <br />

              <TextField
                 id={"end"}
                 onChange={this.onChange}
                 floatingLabelText={"end"}
                 errorText={isNaN(this.state.feature.end) && "not a number"}
                 value={this.state.feature.end.toString()}
                 />

              <br />

              <TextField
                 id={"strand"}
                 onChange={this.onChange}
                 floatingLabelText={"strand"}
                 errorText={isNaN(this.state.feature.strand) && "not a number"}
                 value={this.state.feature.strand.toString()}
                />
                <br/>
                {saveButton}
            </div>
        );
    }
}
