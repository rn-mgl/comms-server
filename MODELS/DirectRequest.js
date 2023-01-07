const db = require("../DB/connection");

class DirectRequest {
  constructor(request_by, request_to) {
    this.request_by = request_by;
    this.request_to = request_to;
  }

  async createRequest() {
    const date = new Date();
    try {
      const sql = `INSERT INTO direct_requests SET ?`;
      const insertValues = {
        request_by: this.request_by,
        request_to: this.request_to,
        date_requested: date,
      };
      const [data, _] = await db.query(sql, insertValues);
      return data;
    } catch (error) {
      console.log(error + "   create request   ");
    }
  }

  static async cancelRequest(request_by, request_id) {
    try {
      const sql = `DELETE FROM direct_requests
                   WHERE request_id = '${request_id}'
                   AND request_by = '${request_by}'`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   cancel request   ");
    }
  }

  static async deleteRequest(request_by, request_to) {
    try {
      const sql = `DELETE FROM direct_requests
                  WHERE (request_to = '${request_to}'
                  AND request_by = '${request_by}')
                  OR
                  (request_by = '${request_to}'
                  AND request_to = '${request_by}')`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   cancel request   ");
    }
  }

  static async acceptRequest(request_to, request_by, request_id) {
    try {
      const sql = `UPDATE direct_requests SET ?
                   WHERE request_id = '${request_id}'
                   AND request_to = '${request_to}'
                   AND request_by = '${request_by}'`;
      const updateValues = { is_accepted: 1 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   accept request   ");
    }
  }

  static async rejectRequest(request_to, request_by, request_id) {
    try {
      const sql = `DELETE FROM direct_requests
                   WHERE request_id = '${request_id}'
                   AND request_to = '${request_to}'
                   AND request_by = '${request_by}'`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   reject request   ");
    }
  }

  static async getAllSentRequest(id) {
    try {
      const sql = `SELECT dr.request_id, dr.request_by, dr.is_accepted, dr.date_requested,
                  CONCAT(u.name, " ", u.surname) AS request_to_name, u.email AS request_to_email
                  FROM direct_requests dr
                  INNER JOIN users u ON dr.request_to = u.user_id
                  WHERE request_by = '${id}'
                  AND is_accepted IS NULL`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async getAllReceivedRequest(id) {
    try {
      const sql = `SELECT dr.request_id, dr.request_by, dr.is_accepted, dr.date_requested,
                  CONCAT(u.name, " ", u.surname) AS request_from_name, u.email AS request_from_email
                   FROM direct_requests dr
                   INNER JOIN users u ON dr.request_by = u.user_id
                  WHERE request_to = '${id}'
                  AND is_accepted IS NULL`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DirectRequest;
