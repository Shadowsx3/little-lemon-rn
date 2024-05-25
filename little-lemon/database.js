import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabase("lemon");

const selectAllMenu = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        tx.executeSql(
          `
              CREATE TABLE IF NOT EXISTS menu (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  price NUMERIC NOT NULL,
                  description TEXT NOT NULL,
                  image TEXT NOT NULL,
                  category TEXT NOT NULL
                  );
                  `
        );

        tx.executeSql("select * from menu", [], (_, { rows }) => {
          const menu = rows._array;
          resolve(menu);
        });
      } catch (error) {
        console.error("ERROR GETTING MENU", error);
        reject(error);
      }
    });
  });
};

const getDataFromApiAsync = async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
    );
    const json = await response.json();
    return json.menu;
  } catch (error) {
    console.error(error);
  }
};

const insertDish = (db, dishName, description, price, photoUri, category) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into menu (name,price,description,image,category) values (?,?,?,?,?)",
          [dishName, price, description, photoUri, category]
        );
      },
      reject,
      resolve
    );
  });
};

const resetDatabase = (db) => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(
        (tx) => {
          tx.executeSql("DROP TABLE IF EXISTS menu");
        },
        reject,
        resolve
      );
    } catch (error) {
      console.error("Error Reseting database", error);
      reject(error);
    }
  });
};

const checkMenuTableAndPopulateData = async (db) => {
  const dbMenu = await selectAllMenu(db);
  if (dbMenu?.length) return dbMenu;
  const menuItemsFromApi = await getDataFromApiAsync();

  const formattedItemsFromApi = menuItemsFromApi.map((item) => ({
    ...item,
    image: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
  }));
  for (const item of formattedItemsFromApi) {
    await insertDish(
      db,
      item.name,
      item.description,
      item.price,
      item.image,
      item.category
    );
  }
  const menuItems = await selectAllMenu(db);
  return menuItems;
};

const filterMenuItems = async (db, activeCategories, query) => {
  const possibleCategory =
    activeCategories.length > 0
      ? ` and category in ('${activeCategories
          .map((v) => v.toLowerCase())
          .join("','")}')`
      : "";
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from menu where name like ? ${possibleCategory}`,
        [`%${query}%`],
        (_, { rows }) => {
          console.log("Filtered items fetched successfully.");
          resolve(rows._array);
        },
        (_, error) => {
          console.error("Error fetching filtered items: ", error);
          reject(error);
          return false; // Rollback transaction on error
        }
      );
    });
  });
};

export {
  database,
  filterMenuItems,
  selectAllMenu,
  insertDish,
  checkMenuTableAndPopulateData,
  getDataFromApiAsync,
  resetDatabase,
};
