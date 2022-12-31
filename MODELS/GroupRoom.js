const db = require("../DB/connection");
const RoomFunctions = require("./FUNCTIONS/RoomFunctions");

class GroupRoom {
  constructor(room_code, member_id, group_name) {
    this.room_code = room_code;
    this.member_id = member_id;
    this.group_name = group_name;
  }

  async createGroupRoom() {
    try {
      const sql = `INSERT INTO group_room SET ?`;
      const insertValues = {
        room_code: this.room_code,
        member_id: this.member_id,
        group_name: this.group_name,
        is_admin: 1,
      };
      const [data, _] = await db.query(sql, insertValues);
      return data;
    } catch (error) {
      console.log(error + "   create group room   ");
    }
  }

  static async addGroupMember(member_email, room_code, theme, group_name) {
    try {
      const sql = `INSERT INTO group_room (member_id, room_code, theme, group_name)
                    VALUES(
                        (SELECT u.user_id FROM users u
                        WHERE u.email = '${member_email}'),
                        '${room_code}', '${theme}', '${group_name}')`;
      const [data, _] = await db.execute(sql);
      const updateRoom = await RoomFunctions.updateGroupRoomDate(room_code);
      return data;
    } catch (error) {
      console.log(error + "   add group member   ");
    }
  }

  static async checkIfMember(member_email, room_code) {
    try {
      const sql = `SELECT COUNT(*) AS member_already
                FROM group_room gr
                WHERE gr.room_code = '${room_code}'
                AND gr.member_id = (SELECT user_id 
                                    FROM users 
                                    WHERE email = '${member_email}')
                AND (gr.is_member = '1' 
                     OR gr.is_member = '0');`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   check if error   ");
    }
  }

  static async reAddMember(member_email, room_code) {
    try {
      const sql = `UPDATE group_room gr SET ?
                  WHERE gr.room_code = '${room_code}'
                  AND gr.member_id = (SELECT user_id
                                      FROM users
                                      WHERE email = '${member_email}')`;
      const updateValues = { is_member: 1 };
      const [data, _] = await db.query(sql, updateValues);
      const updateRoom = await RoomFunctions.updateGroupRoomDate(room_code);
      return data;
    } catch (error) {
      console.log(error + "   re add member   ");
    }
  }

  static async removeMember(member_email, room_code) {
    try {
      const sql = `UPDATE group_room SET ?
                    WHERE member_id = (SELECT user_id 
                                        FROM users
                                        WHERE email = '${member_email}')
                    AND room_code = '${room_code}'`;
      const updateValues = { is_member: 0 };
      const [data, _] = await db.query(sql, updateValues);
      const updateRoom = await RoomFunctions.updateGroupRoomDate(room_code);
      return data;
    } catch (error) {
      console.log(error + "   remove member   ");
    }
  }

  static async leaveGroup(member_id, room_id) {
    try {
      const sql = `UPDATE group_room SET ?
                    WHERE member_id = '${member_id}'
                    AND room_id = '${room_id}'`;
      const updateValues = { is_member: 0 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   leave group   ");
    }
  }

  static async getGroupRoom(room_code, currUser) {
    try {
      const sql = `SELECT gr.room_id, gr.room_code, gr.member_id, gr.is_admin, gr.theme, gr.is_seen, gr.date_created,
                  gr.group_name AS room_name, gr.group_image AS room_image, "1" AS is_active FROM group_room gr
                    WHERE room_code = '${room_code}'
                    AND member_id = '${currUser}'
                    AND is_member = '1'`;
      const [data, _] = await db.execute(sql);

      return data;
    } catch (error) {
      console.log(error + "   get group room   ");
    }
  }

  static async getAllGroupRoom(user_id) {
    try {
      const sql = `SELECT gr.room_id, gr.room_code, gr.member_id, gr.is_seen, gr.group_name AS room_name, gr.date_created, "group" AS room_type,
                  gr.group_image AS room_image, "1" AS is_active
                  FROM group_room gr
                  WHERE gr.member_id = '${user_id}' AND gr.is_member = '1'
                  ORDER BY gr.date_created DESC`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all group room   ");
    }
  }
}

module.exports = GroupRoom;
