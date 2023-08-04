# ---------------------------------------------------- Run these query to create database and use them ----------------------------------------------------
create database cyberbazaardatabase;
use cyberbazaardatabase;


# ---------------------------------------------------- Creating table to store users login data ----------------------------------------------------
create table users(email varchar(100) primary key, pwd varchar(20), status int);
select * from users;
delete from users;


# ---------------------------------------------------- Creating table to store sellers profile data ----------------------------------------------------
create table sellers(email varchar(100) primary key, name varchar(50), contact varchar(10), address varchar(200), city varchar(50), idpicname varchar(500));
select * from sellers;
delete from sellers;


# ---------------------------------------------------- Creating table to store products data ----------------------------------------------------
create table products(id int AUTO_INCREMENT primary key, email varchar(100), name varchar(50), contact varchar(10), address varchar(200), city varchar(50), keyword varchar(50), brand varchar(50), price int, modelname varchar(100), description varchar(1000), productpicname varchar(500));
select * from products;
delete from products;


# ---------------------------------------------------- Creating table for cart data ----------------------------------------------------
create table cart(useremail varchar(100), id int, productpicname varchar(500), modelname varchar(100), brand varchar(50), price int);
select * from cart;
delete from cart;


# ---------------------------------------------------- Run these queries if you want to delete the database or a table ----------------------------------------------------
# DROP DATABASE cyberbazaardatabase;
# DROP TABLE {table_name};