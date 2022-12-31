const db = require("../DB/connection");

class User {
  constructor(name, surname, email, password, in_comms_name) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.in_comms_name = in_comms_name;
  }

  async createUser() {
    try {
      const date = new Date();

      const sql = "INSERT INTO users SET ?";

      const userData = {
        name: this.name,
        surname: this.surname,
        email: this.email,
        password: this.password,
        in_comms_name: this.in_comms_name,
        date_joined: date,
      };

      const [data, _] = await db.query(sql, userData);
      return data;
    } catch (error) {
      console.log(error + "   create user   ");
    }
  }

  static async updateUser(user_id, name, surname, password, in_comms_name) {
    try {
      const sql = `UPDATE users SET ? 
                    WHERE user_id = '${user_id}'`;

      const updateValues = {
        name,
        surname,
        password,
        in_comms_name,
      };

      const [data, _] = await db.query(sql, updateValues);

      return data;
    } catch (error) {
      console.log(error + "   update user   ");
    }
  }

  static async deleteUser(user_id) {
    try {
      const sql = `DELETE FROM users 
                  WHERE user_id = '${user_id}'`;

      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   delete user   ");
    }
  }

  static async getUser(user_id) {
    try {
      const sql = `SELECT * FROM users
                  WHERE user_id = '${user_id}'`;

      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get user   ");
    }
  }

  static async findByEmail(email) {
    try {
      const sql = `SELECT * FROM users
                  WHERE email = '${email}'`;

      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   find email   ");
    }
  }

  static async confirmUser(id) {
    try {
      const sql = `UPDATE users SET ?
                  WHERE user_id = '${id}'`;
      const updateValues = { is_confirmed: "1" };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   confirm user   ");
    }
  }

  static async userActive(id) {
    try {
      const sql = `UPDATE users SET ?
                  WHERE user_id = '${id}';`;
      const updateValues = { is_active: 1 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   active user   ");
    }
  }

  static async userInactive(id) {
    try {
      const sql = `UPDATE users SET ?
                  WHERE user_id = '${id}';`;
      const updateValues = { is_active: 0 };
      const [data, _] = await db.query(sql, updateValues);
      return data;
    } catch (error) {
      console.log(error + "   active user   ");
    }
  }
}

module.exports = User;
