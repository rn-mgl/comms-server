const db = require("../DB/connection");
const RoomFunctions = require("./FUNCTIONS/RoomFunctions");

class GroupMessage {
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
      const sql = `INSERT INTO group_messages SET ?`;
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
      console.log(error + "   send group message   ");
    }
  }

  static async unsendMessage(message_id) {
    try {
      const sql = `UPDATE group_messages SET ?
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
      const sql = `UPDATE group_messages SET ?
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

  static async getAllGroupMessage(room_code, limit) {
    try {
      const sql = `SELECT gm.message_id, gm.sender_id, gm.room_id, gm.room_code, gm.message_content, gm.message_file, 
                  gm.is_visible, gm.date_created, u.name AS sender_name, 
                  CASE WHEN r.message_content IS NOT NULL THEN r.message_content ELSE r.message_file END AS reply_to 
                  FROM group_messages gm
                  INNER JOIN users u ON gm.sender_id = u.user_id
                  LEFT JOIN group_messages r ON gm.reply_to = r.message_id
                  WHERE gm.room_code = '${room_code}'
                  AND gm.is_visible = '1'
                  ORDER BY date_created DESC
                  LIMIT 0, ${limit}`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all group message   ");
    }
  }

  static async getLatestGroupMessage(room_code) {
    try {
      const sql = `SELECT * FROM group_messages
                  WHERE room_code = '${room_code}'
                  AND is_visible = '1'
                  ORDER BY date_created DESC
                  LIMIT 1`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get latest group message   ");
    }
  }
}

module.exports = GroupMessage;
