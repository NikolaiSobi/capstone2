import pkg from 'pg';

var config = {
    user: 'nikolai', 
    database: 'fleshandblood', 
    password: 'new_password', 
    host: 'localhost', 
    port: 5432,
    options: '-c search_path=FleshAndBlood',
};

const db = new pkg.Pool(config);


export default db