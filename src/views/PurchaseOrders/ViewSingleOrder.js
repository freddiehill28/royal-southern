import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row} from 'reactstrap';

class ViewSingleOrder extends Component {
    render() {
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>{this.props.match.params.uid}</CardHeader>
                </Card>
            </div>
        )
    }
}

export default ViewSingleOrder;
