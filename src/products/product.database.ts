import { Product, Products, UnitProduct } from "./product.interface";
import { v4 as random } from "uuid";
import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "rest_api_new", 
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

export const findAll = async (): Promise<UnitProduct[]> => {
  const query = "SELECT * FROM products";
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results: UnitProduct[]) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

export const findOne = async (id: string): Promise<UnitProduct | null> => {
  const query = "SELECT * FROM products WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [id], (error, results: UnitProduct[]) => {
      if (error) {
        reject(error);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]);
        }
      }
    });
  });
};

export const create = async (productInfo: Product): Promise<UnitProduct | null> => {
  const id = random();
  const newProduct: UnitProduct = { id, ...productInfo };
  const query = "INSERT INTO products SET ?";
  return new Promise((resolve, reject) => {
    connection.query(query, newProduct, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(newProduct);
      }
    });
  });
};

export const update = async (
  id: string,
  updateValues: Partial<Product>
): Promise<UnitProduct | null> => {
  const product = await findOne(id);
  if (!product) {
    return null;
  }
  const updatedProduct: UnitProduct = { ...product, ...updateValues };
  const query = "UPDATE products SET ? WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [updatedProduct, id], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(updatedProduct);
      }
    });
  });
};

export const remove = async (id: string): Promise<void> => {
  const query = "DELETE FROM products WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [id], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export default connection; // Export the MySQL connection