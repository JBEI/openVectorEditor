// popup triggered by selectSafeFeatures
// allows user to turn off safe edit, and decide whther or not to proceed with an unsafe delete

import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
// var assign = require('lodash/object/assign');


@Cerebral({
    showSafeEditModal: ['showSafeEditModal']
})

export default class SafeEditModal extends React.Component {


    render() {
            var {
                showSafeEditModal
            } = this.props;

        if(!showSafeEditModal) return null;

        else return ( // syntactically redundant but just tryign to be explciit
            <div>ATTN: Safe Edit is on, and proceeding with delete would affect one or more features.</div>
        );
    }
}