const HUBSPOT_ACCESS_TOKEN = "";
const BASE_URL = "https://api.hubapi.com";

// コンタクト一覧
function indexContacts() {
  const path = "/crm/v3/objects/contacts";
  const query = {};
  const header = {
    "Content-Type": "application/json",
    authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
  };

  get(`${BASE_URL}${path}`, query, header);
}

// コンタクト作成
function createContact() {
  const path = "/crm/v3/objects/contacts";
  const body = {
    company: "Biglytics",
    email: "bcooper@biglytics.net",
    firstname: "Bryan",
    lastname: "Cooper",
    phone: "(877) 929-0687",
    website: "biglytics.net",
  };
  const header = {
    "Content-Type": "application/json",
    authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
  };

  post(`${BASE_URL}${path}`, body, header);
}

/**
 * POSTリクエストを送信する
 * @param {string} url
 * @param {Object} query
 * @param {Object} headers
 */
function get(
  url,
  query = {},
  headers = { "Content-Type": "application/json" }
) {
  const options = {
    method: "GET",
    headers,
  };

  const queryStr = new URLSearchParams(query).toString();
  const response = UrlFetchApp.fetch(`${url}?${queryStr}`, options);
  const jsonResponse = JSON.parse(response);

  Logger.log(jsonResponse);
}

/**
 * POSTリクエストを送信する
 * @param {string} url
 * @param {Object} body
 * @param {Object} headers
 */
function post(url, body, headers = { "Content-Type": "application/json" }) {
  const options = {
    method: "POST",
    headers,
    payload: JSON.stringify(body),
  };

  const response = UrlFetchApp.fetch(url, options);
  const jsonResponse = JSON.parse(response);

  Logger.log(jsonResponse);
}
