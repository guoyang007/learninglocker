import React, { Component, PropTypes } from 'react';
import { Map, List, fromJS } from 'immutable';
import Switch from 'ui/components/Material/Switch';
import QueryBuilder from 'ui/containers/QueryBuilder';

export default class QueryEditor extends Component {
  static propTypes = {
    timezone: PropTypes.string,
    orgTimezone: PropTypes.string.isRequired,
    query: PropTypes.instanceOf(Map),
    componentPath: PropTypes.instanceOf(List),
    changeQuery: PropTypes.func,
    onChangeTimezone: PropTypes.func,
  }

  shouldComponentUpdate = nextProps => {
    const x = !((
      this.props.query === undefined &&
      nextProps.query !== undefined
    ) && (
      this.props.query == null &&
      nextProps.query !== null
    ) && (
      (this.props.query !== undefined && this.props.query !== null) &&
      this.props.query.equals(nextProps.query)
    ))
    || this.props.orgTimezone !== nextProps.orgTimezone
    || this.props.timezone !== nextProps.orgTimezone;
  console.log(x);
  return x;
  }

  toggleQuery = (enabled) => {
    const query = enabled === true ? fromJS({ $match: {} }) : undefined;
    this.props.changeQuery(query);
  }

  changeQuery = (query) => {
    this.props.changeQuery(fromJS({ $match: query }));
  }

  hasQuery = () => this.props.query !== undefined && this.props.query !== null;

  render = () => (
    <div>
      <Switch
        checked={this.hasQuery()}
        label="Query"
        onChange={this.toggleQuery} />
      {
          this.hasQuery() &&
            <QueryBuilder
              timezone={this.props.timezone}
              orgTimezone={this.props.orgTimezone}
              componentPath={this.props.componentPath}
              query={this.props.query.get('$match', new Map())}
              onChange={this.changeQuery}
              onChangeTimezone={this.props.onChangeTimezone} />
        }
    </div>
    )
}
