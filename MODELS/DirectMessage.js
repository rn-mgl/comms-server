const db = require("../DB/connection");
const RoomFunctions = require("./FUNCTIONS/RoomFunctions");

class DirectMessage {
  constructor(sender_id, receiver_id, room_id, room_code, message_content, message_file) {
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.room_id = room_id;
    this.room_code = room_code;
    this.message_content = message_content;
    this.message_file = message_file;
  }

  async sendMessage() {
    try {
      const sql = `INSERT INTO direct_messages SET ?`;
      const insertValues = {
        sender_id: this.sender_id,
        receiver_id: this.receiver_id,
        room_id: this.room_id,
        room_code: this.room_code,
        message_content: this.message_content,
        message_file: this.message_file,
      };
      const [data, _] = await db.query(sql, insertValues);
      const updateRoom = await RoomFunctions.updateDirectRoomDate(this.room_code);
      return data;
    } catch (error) {
      console.log(error + "   send message   ");
    }
  }

  async replyToMessage(message_id) {
    try {
      const sql = `INSERT INTO direct_messages SET ?`;
      const insertValues = {
        sender_id: this.sender_id,
        receiver_id: this.receiver_id,
        room_id: this.room_id,
        room_code: this.room_code,
        message_content: this.message_content,
        message_file: this.message_file,
        reply_to: message_id,
      };

      const [data, _] = await db.query(sql, insertValues);
      const updateRoom = await RoomFunctions.updateDirectRoomDate(this.room_code);
      return data;
    } catch (error) {
      console.log(error + "   reply to message   ");
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
      const sql = `SELECT dm.message_id, dm.sender_id, dm.receiver_id, dm.room_id, dm.room_code, dm.message_content, dm.message_file, dm.is_visible,
                  dm.reply_to, dm.date_created, s.name AS sender_name, r.name AS receiver_name FROM direct_messages dm
                  INNER JOIN users s ON s.user_id = dm.sender_id
                  INNER JOIN users r ON r.user_id = dm.receiver_id
                  WHERE room_code = '${room_code}'
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
      const sql = `SELECT * FROM direct_messages
                  WHERE room_code = '${room_code}'
                  AND is_visible = '1'
                  ORDER BY date_created DESC
                  LIMIT 1`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get latest direct message   ");
    }
  }
}

module.exports = DirectMessage;
