const db = require("../DB/connection");

class GroupRequest {
  constructor(request_by, request_to, room_code, group_name) {
    this.request_by = request_by;
    this.request_to = request_to;
    this.room_code = room_code;
    this.group_name = group_name;
  }

  async createRequest() {
    try {
      const sql = `INSERT INTO group_requests SET ?`;
      const insertValues = {
        request_by: this.request_by,
        request_to: this.request_to,
        room_code: this.room_code,
        group_name: this.group_name,
      };
      const [data, _] = await db.query(sql, insertValues);
      return data;
    } catch (error) {
      console.log(error + "   create request   ");
    }
  }

  static async cancelRequest(request_by, request_id) {
    try {
      const sql = `DELETE FROM group_requests
                   WHERE request_id = '${request_id}'
                   AND request_by = '${request_by}'`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   cancel request   ");
    }
  }

  static async deleteRequest(request_to, room_code) {
    try {
      const sql = `DELETE FROM group_requests
                   WHERE (request_to = '${request_to}'
                   AND room_code = '${room_code}')
                   OR
                   (request_by = '${request_to}'
                   AND room_code = '${room_code}')`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   cancel request   ");
    }
  }

  static async acceptRequest(request_to, request_by, request_id) {
    try {
      const sql = `UPDATE group_requests SET ?
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

  static async rejectRequest(request_to, request_by, request_id, room_code) {
    try {
      const sql = `DELETE FROM group_requests
                   WHERE request_id = '${request_id}'
                   AND request_to = '${request_to}'
                   AND request_by = '${request_by}'`;
      const [data, _] = await db.query(sql);
      return data;
    } catch (error) {
      console.log(error + "   reject request   ");
    }
  }

  static async getAllSentRequest(id) {
    try {
      const sql = `SELECT gr.request_id, gr.request_by, gr.is_accepted, gr.date_requested, gr.room_code,
                  gr.group_name AS request_to_name, CONCAT("admin: ", u.name, " ", u.surname) AS request_to_email
                  FROM group_requests gr
                  INNER JOIN users u ON gr.request_to = u.user_id
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
      const sql = `SELECT gr.request_id, gr.request_by, gr.is_accepted, gr.date_requested, gr.room_code,
                  gr.group_name AS request_from_name, CONCAT("admin: ", u.name, " ", u.surname) AS request_from_email
                   FROM group_requests gr
                   INNER JOIN users u ON gr.request_by = u.user_id
                  WHERE request_to = '${id}'
                  AND is_accepted IS NULL`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = GroupRequest;
