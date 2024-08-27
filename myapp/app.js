const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())
let db = null

const dbPath = path.join(__dirname, "exeloncities.db")

const intiallizeDBAndrunserver = async () => {
    try {
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      })
      app.listen(3000, () => {
        console.log('running at 3000')
      })
    } catch (e) {
      console.log(e.message)
      process.exit(1)
    }
  }
  intiallizeDBAndrunserver()

  //Add city API

  app.post("/cities/", async (request, response) => {
    const cityDetails = request.body;
    const {
      id, name, population, country, latitude, longitude
    } = cityDetails;
    const addCityQuery = `
      INSERT INTO
        cities (id, name, population, country, latitude, longitude)
      VALUES
        (
            ${id},
          '${name}',
           ${population},
           '${country}',
           '${latitude}',
           '${longitude}'
        );`;
  
    const dbResponse = await db.run(addCityQuery);
    const cityId = dbResponse.lastID;
    response.send(`new city successfully added with cityId ${cityId}`);
  });

  //get cities API
  app.get("/cities/", async (request, response) => {
    const { cityId } = request.params;
    const getcityQuery = `
      SELECT
        *
      FROM
        cities
      ;`;
    const city = await db.all(getcityQuery);
    response.send(city);
});

//Delete city API
app.delete("/cities/:cityId/", async (request, response) => {
    const { cityId } = request.params;
    const deleteCityQuery = `
      DELETE FROM
        cities
      WHERE
        id = ${cityId};`;
    await db.run(deleteCityQuery);
    response.send("City Deleted Successfully");
  });

  
 