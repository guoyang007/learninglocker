import { Map, List, fromJS } from 'immutable';
import update$dteTimezone from 'ui/utils/queries/update$dteTimezone';
import grouper from 'ui/utils/visualisations/aggregationGroup/grouper';

const aggregateScatterAxis = (axis, preReqs, axes, timezone) => {
  const valueType = axes.getIn([`${axis}Value`, 'optionKey']);
  const groupType = axes.getIn(['group', 'optionKey']);
  const operatorType = axes.get(`${axis}Operator`);

  const match = axes.getIn([`${axis}Query`, '$match'], new Map());
  // Set timezone of When filters (timestamp and stored)
  const offsetFixedMatch = update$dteTimezone(match, timezone);
  const matchStage = offsetFixedMatch.size === 0 ? [] : [{ $match: offsetFixedMatch }];

  const aggregationGroup = grouper({ valueType, groupType, operatorType, timezone });
  const pipeline = preReqs.concat(fromJS(matchStage)).concat(fromJS(aggregationGroup));
  return pipeline;
};

/**
 * @param {*} preReqs
 * @param {*} axes
 * @param {string} timezone
 * @returns {immutable.List}
 */
export default (preReqs, axes, timezone) => new List([
  aggregateScatterAxis('x', preReqs, axes, timezone),
  aggregateScatterAxis('y', preReqs, axes, timezone),
]);
