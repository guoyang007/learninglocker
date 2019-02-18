import { Map, List } from 'immutable';
import moment from 'moment-timezone';
import pipelineFromQuery from './pipelineFromQuery';

/**
 * build pipelines from queries
 *
 * @param {immutable.List} queries
 * @param {immutable.Map} axes
 * @param {string} type - VISUALISATION_TYPES
 * @param {string} previewPeriod - See ui/src/utils/constants.js
 * @param {*} id
 * @param {string} timezone
 * @param {boolean} benchmarkingEnabled - optional
 * @returns immutable.List
 */
export default (
  queries,
  axes,
  type,
  previewPeriod,
  id,
  timezone,
  benchmarkingEnabled = false,
) => {
  // seconds of current time is 00 to avoid over updating.
  const currentMoment = moment().utc().startOf('minute');

  if (benchmarkingEnabled) {
    const out = queries.map(query =>
      new List([
        pipelineFromQuery(new Map({
          query, axes, type, previewPeriod, id, timezone, currentMoment
        })),
        pipelineFromQuery(new Map({
          query, axes, type, previewPeriod, id, timezone, currentMoment, benchmarkingEnabled
        }))
      ])
    ).flatten(1);

    return out;
  }

  // pipelineFromQuery is memoized
  return queries.map(query => pipelineFromQuery(new Map({
    query, axes, type, previewPeriod, id, timezone, currentMoment
  })));
};
