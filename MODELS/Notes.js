const db = require("../DB/connection");

class Notes {
  constructor(user_id, note_title, note_content, note_file) {
    this.user_id = user_id;
    this.note_title = note_title;
    this.note_content = note_content;
    this.note_file = note_file;
  }

  async createNote() {
    try {
      const sql = `INSERT INTO notes SET ?`;
      const insertValues = {
        user_id: this.user_id,
        note_title: this.note_title,
        note_content: this.note_content,
        note_file: this.note_file,
      };
      const [data, _] = await db.query(sql, insertValues);
      return data;
    } catch (error) {
      console.log(error + "   create note   ");
    }
  }

  async updateNote(note_id) {
    try {
      const sql = `UPDATE notes SET ?
                  WHERE note_id = '${note_id}'
                  AND user_id = '${this.user_id}'`;
      const updateValues = {
        note_title: this.note_title,
        note_content: this.note_content,
        note_file: this.note_file,
      };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   update note   ");
    }
  }

  static async deleteNote(note_id, user_id) {
    try {
      const sql = `DELETE FROM notes
                  WHERE note_id = '${note_id}'
                  AND user_id = '${user_id}'`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   delete note   ");
    }
  }

  static async deleteMultipleNotes(note_ids, user_id) {
    try {
      note_ids.forEach(async (id) => {
        const sql = `DELETE FROM notes
                    WHERE note_id = '${id}'
                    AND user_id = '${user_id}';`;
        const [data, _] = await db.execute(sql);
      });
      return "deleted";
    } catch (error) {
      console.log(error + "   delete multiple notes   ");
    }
  }

  static async getAllNotes(user_id) {
    try {
      const sql = `SELECT * FROM notes
                  WHERE user_id = '${user_id}'
                  ORDER BY date_created DESC`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all notes   ");
    }
  }

  static async getNote(note_id) {
    try {
      const sql = `SELECT * FROM notes
                  WHERE note_id = '${note_id}'`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get note   ");
    }
  }
}

module.exports = Notes;
