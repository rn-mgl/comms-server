const db = require("../DB/connection");

class DirectRoom {
  constructor() {}

  static async addUserEmail(addedUser, currUser, roomCode) {
    try {
      const sqlAdded = `INSERT INTO direct_room (member_id, room_code) 
                        VALUES(
                          (SELECT user_id FROM users WHERE email = '${addedUser}'), 
                          '${roomCode}'
                        );`;

      const sqlCurr = `INSERT INTO direct_room (member_id, room_code)
                        VALUES('${currUser}', '${roomCode}')`;

      const [data1, _1] = await db.execute(sqlAdded);
      const [data2, _2] = await db.execute(sqlCurr);

      return { data1, data2 };
    } catch (error) {
      console.log(error + "   add user   ");
    }
  }

  static async addUserById(addedUser, currUser, roomCode) {
    try {
      const sqlAdded = `INSERT INTO direct_room (member_id, room_code) 
                        VALUES('${addedUser}', '${roomCode}');`;

      const sqlCurr = `INSERT INTO direct_room (member_id, room_code)
                        VALUES('${currUser}', '${roomCode}')`;

      const [data1, _1] = await db.execute(sqlAdded);
      const [data2, _2] = await db.execute(sqlCurr);

      return { data1, data2 };
    } catch (error) {
      console.log(error + "   add user   ");
    }
  }

  static async unfriendUser(roomCode) {
    try {
      const sql = `DELETE FROM direct_room
                    WHERE room_code = '${roomCode}'`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   unfriend user   ");
    }
  }

  static async getDirectRoom(room_code, currUser) {
    try {
      const sql = `SELECT d.room_id, d.room_code, d.member_id, "1" AS is_admin, d.theme, d.is_seen, d.date_created, d.is_muted, d.is_blocked,
                  (CASE WHEN u.in_comms_name IS NULL THEN CONCAT(u.name, " ", u.surname) ELSE u.in_comms_name END) AS room_name, 
                  u.image AS room_image, u.is_active

                  FROM direct_room d

                  INNER JOIN users u ON u.user_id = d.member_id

                  WHERE room_code = '${room_code}'
                  AND member_id <> '${currUser}'`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get direct room   ");
    }
  }

  static async getAllDirectRoom(currUser) {
    try {
      const sql = `SELECT d.room_id, d.room_code, d.member_id, d.is_seen, 
                  (CASE WHEN u.in_comms_name IS NULL THEN CONCAT(u.name, " ", u.surname) ELSE u.in_comms_name END) AS room_name, 
                  d.date_created, d.is_muted, d.is_blocked, "direct" AS room_type, u.image AS room_image, u.is_active

                  FROM direct_room d

                  INNER JOIN users u ON u.user_id = d.member_id
                  
                  WHERE d.room_code IN (SELECT room_code FROM direct_room
                                      WHERE member_id = '${currUser}')
                  AND member_id <> '${currUser}'
                  AND is_blocked = '0'
                  ORDER BY d.date_created DESC`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all direct room   ");
    }
  }

  static async getAllBlockedRoom(id) {
    try {
      const sql = `SELECT d.room_id, d.room_code, d.member_id, d.is_seen, 
            (CASE WHEN u.in_comms_name IS NULL THEN CONCAT(u.name, " ", u.surname) ELSE u.in_comms_name END) AS room_name,  
              d.date_created, d.is_muted, d.is_blocked, "direct" AS room_type, u.image AS room_image, u.is_active

              FROM direct_room d

              INNER JOIN users u ON u.user_id = d.member_id

              WHERE room_code IN (SELECT room_code FROM direct_room
                                  WHERE member_id = '${id}')
              AND member_id <> '${id}'
              AND is_blocked = '${id}'
              ORDER BY date_created DESC`;

      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all blocked room   ");
    }
  }
}

module.exports = DirectRoom;
