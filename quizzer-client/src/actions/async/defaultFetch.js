import * as GLOBALS from '../../globals';

/**
 *
 * @param {*} api_path path to the quizzer api resource
 * @param {*} method method used for the fetch
 * @param {*} body stringified JSON body
 * defaultFetch returns a promise with
 * {APIerr: statuscode, data}
 */
const defaultFetch = (api_path, method, body) => {
  console.log(GLOBALS.API_URL);
  return (
    fetch(`${GLOBALS.API_URL}${api_path}`, {
      ...GLOBALS.FETCH_OPTIONS,
      method: method,
      body: body,
    })
      // Fetch went ok, server is up
      .then((res) => {
        return res.json().then((parsed) => {
          if (!res.ok)
            return { APIerr: res.status ? res.status : true, data: parsed };
          else return { data: parsed };
        });
      })
      // Server might be down!
      .catch((err) => {
        console.log(err);
        return Promise.reject('The API is not responding!');
      })
  );
};

export default defaultFetch;
