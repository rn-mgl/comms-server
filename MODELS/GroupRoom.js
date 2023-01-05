const db = require("../DB/connection");
const RoomFunctions = require("./FUNCTIONS/RoomFunctions");

class GroupRoom {
  constructor(room_code, member_id, group_name, is_public) {
    this.room_code = room_code;
    this.member_id = member_id;
    this.group_name = group_name;
    this.is_public = is_public;
  }

  async createGroupRoom() {
    try {
      const sql = `INSERT INTO group_room SET ?`;
      const insertValues = {
        room_code: this.room_code,
        member_id: this.member_id,
        group_name: this.group_name,
        is_public: this.is_public,
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
      const sql = `INSERT INTO group_room (member_id, room_code, theme, group_name, is_public, group_image)
                    VALUES(
                        (SELECT u.user_id FROM users u
                        WHERE u.email = '${member_email}'),
                        '${room_code}', '${theme}', '${group_name}',
                        (SELECT FIRST(is_public) FROM group_room WHERE room_code = '${room_code}'),
                        (SELECT FIRST(group_image) FROM group_room WHERE room_code = '${room_code}'))`;
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
                  AND gr.is_blocked = '0'
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

  static async leaveGroup(member_id, room_code) {
    try {
      const sql = `UPDATE group_room SET ?
                    WHERE member_id = '${member_id}'
                    AND room_code = '${room_code}'`;
      const updateValues = { is_member: 0 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   leave group   ");
    }
  }

  static async getGroupRoom(room_code, currUser) {
    try {
      const sql = `SELECT gr.room_id, gr.room_code, gr.member_id, gr.is_admin, gr.theme, gr.is_seen, gr.date_created, gr.is_muted, gr.is_blocked,
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
      const sql = `SELECT gr.room_id, gr.room_code, gr.member_id, gr.is_seen, gr.group_name AS room_name, gr.date_created, "group" AS room_type, gr.is_muted, gr.is_blocked,
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

  static async getAllPublicGroupRoom(user_id) {
    try {
      const sql = `SELECT gr.room_id, gr.room_code, gr.member_id, gr.is_seen, gr.group_name AS room_name, gr.date_created, "group" AS room_type, gr.is_muted, gr.is_blocked,
                  gr.group_image AS room_image, "1" AS is_active, CONCAT(u.name, " ", u.surname) AS admin
                  FROM group_room gr
                  INNER JOIN users u ON u.user_id = gr.member_id
                  WHERE NOT EXISTS (SELECT * FROM group_room alt_gr WHERE alt_gr.member_id = '${user_id}' 
                                      AND alt_gr.is_member = '1' 
                                      AND alt_gr.room_code = gr.room_code)
                  AND gr.is_admin = '1'
                  AND gr.is_public = '1'
                  ORDER BY gr.date_created DESC`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all group room   ");
    }
  }

  static async getAllPrivateGroupRoom(user_id) {
    try {
      const sql = `SELECT gr.room_id, gr.room_code, gr.member_id, gr.is_seen, gr.group_name AS room_name, gr.date_created, "group" AS room_type, gr.is_muted, gr.is_blocked,
                  gr.group_image AS room_image, "1" AS is_active, CONCAT(u.name, " ", u.surname) AS admin
                  FROM group_room gr
                  INNER JOIN users u ON u.user_id = gr.member_id
                  WHERE gr.is_admin = '1' AND (gr.member_id <> '${user_id}' OR gr.is_member = '0')  
                  AND gr.is_public = '0'
                  AND NOT EXISTS (SELECT * FROM group_requests greq WHERE greq.request_by = '${user_id}' AND greq.request_to = gr.member_id)
                  ORDER BY gr.date_created DESC`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all group room   ");
    }
  }

  static async joinRoom(id, room_code) {
    try {
      const sql = `INSERT INTO group_room (room_code, member_id, theme, is_public, group_name, group_image)
                   VALUES('${room_code}', '${id}', 
                   (SELECT theme FROM group_room g WHERE g.room_code = '${room_code}'),
                   (SELECT is_public FROM group_room g WHERE g.room_code = '${room_code}'),
                   (SELECT group_name FROM group_room g WHERE g.room_code = '${room_code}'),
                   (SELECT group_image FROM group_room g WHERE g.room_code = '${room_code}'))`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = GroupRoom;
