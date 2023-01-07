const db = require("../DB/connection");
const RoomFunctions = require("./FUNCTIONS/RoomFunctions");

class DirectMessage {
  constructor(sender_id, room_id, room_code, message_content, message_file, reply_to) {
    this.sender_id = sender_id;
    this.room_id = room_id;
    this.room_code = room_code;
    this.message_content = message_content;
    this.message_file = message_file;
    this.reply_to = reply_to;
  }

  async sendMessage() {
    try {
      const sql = `INSERT INTO direct_messages SET ?`;
      const insertValues = {
        sender_id: this.sender_id,
        room_id: this.room_id,
        room_code: this.room_code,
        message_content: this.message_content,
        message_file: this.message_file,
        reply_to: this.reply_to,
      };
      const [data, _] = await db.query(sql, insertValues);

      return data;
    } catch (error) {
      console.log(error + "   send message   ");
    }
  }

  static async unsendMessage(message_id) {
    try {
      const sql = `UPDATE direct_messages SET ?
                  WHERE message_id = '${message_id}';`;
      const updateValues = {
        message_content: null,
        message_file: null,
      };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   unsend message   ");
    }
  }

  static async deleteMessage(message_id) {
    try {
      const sql = `UPDATE direct_messages SET ?
                  WHERE message_id = '${message_id}';`;
      const updateValues = {
        is_visible: 0,
      };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   delete message   ");
    }
  }

  static async getAllDirectMessage(room_code, limit) {
    try {
      const sql = `SELECT dm.message_id, dm.sender_id, dm.room_id, dm.room_code, dm.message_content, dm.message_file, dm.is_visible,
                  dm.date_created, s.name AS sender_name, r.message_content AS reply_to FROM direct_messages dm
                  INNER JOIN users s ON s.user_id = dm.sender_id
                  LEFT JOIN direct_messages r ON dm.reply_to = r.message_id
                  WHERE dm.room_code = '${room_code}'
                  AND dm.is_visible = '1'
                  ORDER BY date_created DESC
                  LIMIT 0, ${limit}`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all direct message   ");
    }
  }

  static async getLatestDirectMessage(room_code) {
    try {
      const sql = `SELECT dm.message_content, u.name FROM direct_messages dm
                  INNER JOIN users u ON u.user_id = dm.sender_id
                  WHERE dm.room_code = '${room_code}'
                  AND dm.is_visible = '1'
                  ORDER BY dm.date_created DESC
                  LIMIT 1`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get latest direct message   ");
    }
  }
}

module.exports = DirectMessage;
