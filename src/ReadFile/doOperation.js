import { mockFetch } from './mockFetchData';

/**
 *
 * @param {object} query
 * @returns {Promise} contract document
 */
export const getContract = async (query) => {
  // TODO:
  // Get documents with tracker and x query
  // return document
  await mockFetch('getContract', query);
  return { name: 'asas', credit: 'dsdf' };
};

/**
 *
 * @param {object} query
 * @returns {Promise} endoso document
 */
export const composeNewData = async (params) => {
  // TODO:
  // Generate new document in endoso table
  // return document
  await mockFetch('composeNewData', params);
};

/**
 *
 * @param {*} config
 */
export const saveErrors = (params) => {
  // TODO: save error in a file
};

export const doOperation = async (config) => {
  const { params } = config;

  try {
    const contract = await config.getContract(params);
    await config.composeNewData(contract);
  } catch (err) {
    // TODO:
    // saveErrors(params)
    // Write errors params in a file to process later
  }

  return params;
};
