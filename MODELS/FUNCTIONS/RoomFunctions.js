const db = require("../../DB/connection");

class RoomFunctions {
  constructor() {}

  static async updateDirectRoomDate(room_code) {
    const date = new Date();
    try {
      const sql = `UPDATE direct_room SET ? 
                    WHERE room_code = '${room_code}'`;
      const updateValues = { date_created: date };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   update dr date");
    }
  }

  static async updateGroupRoomDate(room_code) {
    const date = new Date();
    try {
      const sql = `UPDATE group_room SET ? 
                    WHERE room_code = '${room_code}'`;
      const updateValues = { date_created: date };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   update dr date");
    }
  }

  static async openDirectRoom(member_id, room_code) {
    try {
      const sql = `UPDATE direct_room SET ? 
                  WHERE room_code = '${room_code}'
                  AND member_id <> '${member_id}'`;
      const updateValues = { is_open: 1 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   open direct room   ");
    }
  }

  static async closeDirectRoom(member_id, room_code) {
    try {
      const sql = `UPDATE direct_room SET ? 
                  WHERE room_code = '${room_code}'
                  AND member_id <> '${member_id}'`;
      const updateValues = { is_open: 0 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   open direct room   ");
    }
  }

  static async openGroupRoom(member_id, room_code) {
    try {
      const sql = `UPDATE group_room SET ? 
                  WHERE room_code = '${room_code}'
                  AND member_id = '${member_id}'`;
      const updateValues = { is_open: 1 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   open direct room   ");
    }
  }

  static async closeGroupRoom(member_id, room_code) {
    try {
      const sql = `UPDATE group_room SET ? 
                  WHERE room_code = '${room_code}'
                  AND member_id = '${member_id}'`;
      const updateValues = { is_open: 0 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   open direct room   ");
    }
  }

  static async seeDirectRoom(member_id, room_code) {
    try {
      const sql = `UPDATE direct_room SET ?
                  WHERE room_code = '${room_code}'
                  AND member_id <> '${member_id}'
                  AND is_open = '1'`;
      const updateValues = { is_seen: 1 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   seen room   ");
    }
  }

  static async unseeDirectRoom(receiver_id, room_code) {
    try {
      const sql = `UPDATE direct_room SET ?
                  WHERE room_code = '${room_code}'
                  AND member_id <> '${receiver_id}'
                  AND is_open = '0'`;
      const updateValues = { is_seen: 0 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   seen room   ");
    }
  }

  static async seeGroupRoom(member_id, room_code) {
    try {
      const sql = `UPDATE group_room SET ?
                  WHERE room_code = '${room_code}'
                  AND member_id = '${member_id}'
                  AND is_open = '1'`;
      const updateValues = { is_seen: 1 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   seen room   ");
    }
  }

  static async unseeGroupRoom(member_id, room_code) {
    try {
      const sql = `UPDATE group_room SET ?
                  WHERE room_code = '${room_code}'
                  AND member_id <> '${member_id}'
                  AND is_open = '0'`;
      const updateValues = { is_seen: 0 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   seen room   ");
    }
  }
}

module.exports = RoomFunctions;
