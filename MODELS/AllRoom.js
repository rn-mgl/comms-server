const db = require("../DB/connection");

class AllRoom {
  constructor() {}

  static async getAllRooms(user_id) {
    try {
      const sql = `SELECT dr.room_id, dr.room_code, dr.member_id, dr.is_seen, (CASE WHEN u.in_comms_name IS NULL THEN CONCAT(u.name, " ", u.surname) ELSE u.in_comms_name END)  AS room_name, 
                     dr.date_created, "direct" AS room_type, dr.is_muted, dr.is_blocked,
                     u.image AS room_image, u.is_active
                     FROM direct_room dr
                     INNER JOIN users u ON dr.member_id = u.user_id
                     WHERE room_code IN (SELECT room_code FROM direct_room WHERE member_id = '${user_id}')
                     AND member_id <> '${user_id}'
                     AND is_blocked = '0'
                     
                     UNION
                     
                     SELECT gr.room_id, gr.room_code, gr.member_id, gr.is_seen, gr.group_name AS room_name, gr.date_created, "group" AS room_type, gr.is_muted, gr.is_blocked,
                     gr.group_image AS room_image,
                     (CASE WHEN EXISTS (SELECT 1 FROM group_room g
                      INNER JOIN users u ON u.user_id = g.member_id
                      WHERE g.room_code = gr.room_code
                      AND u.user_id <> '${user_id}' 
                      AND u.is_active = '1' LIMIT 1) 
                    THEN 1 ELSE 0 END) AS is_active 
                     FROM group_room gr
                     WHERE gr.member_id = '${user_id}' AND gr.is_member = '1'
                     
                     ORDER BY date_created DESC`;

      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all rooms   ");
    }
  }
}

module.exports = AllRoom;
