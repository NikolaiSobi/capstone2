import pkg from 'pg';

var config = {
    user: 'username', // username here for database
    database: 'fleshandblood', 
    password: 'password', // password here for database
    host: 'localhost', 
    port: 5432,
    options: '-c search_path=FleshAndBlood',
};

const db = new pkg.Pool(config);


export default db
