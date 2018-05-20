/**
 * Created by lakshya on 5/18/18.
 */
const Sequelize = require('sequelize');

require('pg').defaults.parseInt8 = true;

const DB_HOST = "localhost";
const DB_USER = "postgres";
const DB_PASS = "abc";
const DB_NAME = "shorturl";
const DB_PORT =  5432;

const DATABASE_URL = (`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

const sequelize = new Sequelize(DATABASE_URL, {
    host: DB_HOST,
    dialect: 'postgres',
    define: {
        createdAt: "createdat",
        updatedAt: "updatedat"
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});


const URL = sequelize.define('url', {
    code: {type: Sequelize.STRING,primaryKey:true },
    longurl: {type: Sequelize.STRING},
    hits: {type: Sequelize.INTEGER, defaultValue: 0},
    time: {type: Sequelize.DATE}
});

const Op = Sequelize.Op;
module.exports = {
    addUrl: function (code, longURL, done, failed) {
            URL.findOrCreate({
                where: {
                    longurl: longURL
                },
                defaults: {
                    code: code,
                    time: new Date(),
                    longurl: longURL
                }

            }).catch(function (error) {
                console.log(error);
                failed(error);
            })


    },
    fetchUrl: function (code, done, failed) {
        URL.findById(code).then(function (url) {
            url.increment('hits');
            done(url.longurl);
        }).catch(function (error) {
            failed(error)
        })
    },
    fetchMultiple: function (array,done,failed) {
     URL.findAll({
         where:{
             code:{
                 [Op.in] : array
             }
         }
     }).then(function (url) {
         done(url);
     }).catch(function (error) {
        failed(error);
     })
    },

    urlStats: function (datas) {

        const offset = (datas.page - 1) * datas.size;
        return URL.findAndCountAll({
            order: [['createdat', 'ASC']],
            limit: datas.size,
            offset: offset
        }).then(data => {
            if (offset > data.count || offset < 0)
                throw new Error('Pagination Error : Out of Error Range');

            const lastPage = Math.ceil(data.count / datas.size);
            return {urls: data.rows, lastPage};
        });
    },
}