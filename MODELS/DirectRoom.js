const db = require("../DB/connection");

class DirectRoom {
  constructor() {}

  static async addUser(addedUser, currUser, roomCode) {
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
      const sql = `SELECT d.room_id, d.room_code, d.member_id, "1" AS is_admin, d.theme, d.is_seen, d.date_created,
                  u.user_id AS receiver_id, CONCAT(u.name, " ", u.surname) AS room_name, u.image AS room_image, u.is_active

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
      const sql = `SELECT d.room_id, d.room_code, d.member_id, d.is_seen, CONCAT(u.name, " ", u.surname) AS room_name, d.date_created,
                  "direct" AS room_type, u.image AS room_image, u.is_active

                  FROM direct_room d

                  INNER JOIN users u ON u.user_id = d.member_id
                  
                  WHERE room_code IN (SELECT room_code FROM direct_room
                                      WHERE member_id = '${currUser}')
                  AND member_id <> '${currUser}'
                  ORDER BY d.date_created DESC`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all direct room   ");
    }
  }
}

module.exports = DirectRoom;
