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

  static async updateUser(user_id, name, surname, password, image, in_comms_name) {
    try {
      const sql = `UPDATE users SET ? 
                    WHERE user_id = '${user_id}'`;

      const updateValues = {
        name,
        surname,
        password,
        image,
        in_comms_name,
      };

      const [data, _] = await db.query(sql, updateValues);

      return data;
    } catch (error) {
      console.log(error + "   update user   ");
    }
  }

  static async updateUserName(user_id, name) {
    try {
      const sql = `UPDATE users SET ? 
                    WHERE user_id = '${user_id}'`;

      const updateValues = {
        name,
      };

      const [data, _] = await db.query(sql, updateValues);

      return data;
    } catch (error) {
      console.log(error + "   update user   ");
    }
  }

  static async updateUserSurname(user_id, surname) {
    try {
      const sql = `UPDATE users SET ? 
                    WHERE user_id = '${user_id}'`;

      const updateValues = {
        surname,
      };

      const [data, _] = await db.query(sql, updateValues);

      return data;
    } catch (error) {
      console.log(error + "   update user   ");
    }
  }

  static async updateUserICN(user_id, in_comms_name) {
    try {
      const sql = `UPDATE users SET ? 
                    WHERE user_id = '${user_id}'`;

      const updateValues = {
        in_comms_name,
      };

      const [data, _] = await db.query(sql, updateValues);

      return data;
    } catch (error) {
      console.log(error + "   update user   ");
    }
  }

  static async updateUserPassword(user_id, password) {
    try {
      const sql = `UPDATE users SET ? 
                    WHERE user_id = '${user_id}'`;

      const updateValues = {
        password,
      };

      const [data, _] = await db.query(sql, updateValues);

      return data;
    } catch (error) {
      console.log(error + "   update user   ");
    }
  }

  static async updateUserImage(user_id, image) {
    try {
      const sql = `UPDATE users SET ? 
                    WHERE user_id = '${user_id}'`;

      const updateValues = {
        image,
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

  static async getAllUsers(id) {
    try {
      const sql = `SELECT u.user_id, CONCAT(u.name, " ", u.surname) AS name, u.email, u.image
                  FROM users u
                  WHERE u.user_id <> ${id}
                  AND NOT EXISTS (SELECT * FROM direct_requests dr 
                                 WHERE (dr.request_by = '${id}' 
                                    AND dr.request_to = u.user_id)
                                 OR (dr.request_by = u.user_id 
                                    AND dr.request_to = '${id}'))`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "   get all users   ");
    }
  }
}

module.exports = User;
