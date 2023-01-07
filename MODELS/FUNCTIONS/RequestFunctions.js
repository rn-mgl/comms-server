const db = require("../../DB/connection");

class RequestFunctions {
  constructor() {}

  static async getCountAllUnseenReceivedRequests(id) {
    try {
      const sql = `SELECT (
                        (SELECT COUNT(*) FROM direct_requests 
                            WHERE request_to = '${id}' AND is_seen = '0') +
                        (SELECT COUNT(*) FROM group_requests 
                            WHERE request_to = '${id}' AND is_seen = '0')
                    )
                   AS request_count FROM DUAL`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get count all unseen receive requests   ");
    }
  }

  static async seeDirectRequests(id) {
    try {
      const sql = `UPDATE direct_requests SET ?
                     WHERE request_to = '${id}'`;
      const updateValues = { is_seen: 1 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   see direct requests   ");
    }
  }

  static async seeGroupRequests(id) {
    try {
      const sql = `UPDATE group_requests SET ?
                     WHERE request_to = '${id}'`;
      const updateValues = { is_seen: 1 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   see group requests   ");
    }
  }
}

module.exports = RequestFunctions;
