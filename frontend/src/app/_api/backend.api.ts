require('dotenv').config();

export const BACKEND_API : string = process.env['BACKEND_API'] ? process.env['BACKEND_API'] : "http://127.0.0.1:8080/";