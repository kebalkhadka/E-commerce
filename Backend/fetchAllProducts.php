<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

class Constants
{
    static $DB_SERVER = "localhost";
    static $DB_NAME = "ecommerce";
    static $USERNAME = "root";
    static $PASSWORD = "";

    static $SQL_SELECT_ALL = "SELECT * FROM products";
}

class Register
{

    public function connect()
    {
        $con = new mysqli(Constants::$DB_SERVER, Constants::$USERNAME, Constants::$PASSWORD, Constants::$DB_NAME);
        if ($con->connect_error) {
            return null;
        } else {
            return $con;
        }
    }
    public function select()
    {
        $con = $this->connect();
        if ($con != null) {
            $result = $con->query(Constants::$SQL_SELECT_ALL);
            if ($result->num_rows > 0) {
                $reg = array();
                while ($row = $result->fetch_array()) {
                    array_push($reg, array("id" => $row['id'], "name" => $row['name'], "details" => $row['details'], "description" => $row['description'], "price" => $row['price'], "image" => $row['image'], "image1" => $row['image1']));
                }
                print(json_encode(array_reverse($reg)));
            } else {
                print(json_encode(array("No records found")));
            }
            $con->close();
        } else {
            print(json_encode(array("PHP EXCEPTION : CAN'T CONNECT TO MYSQL. NULL CONNECTION.")));
        }
    }
}
$reg = new Register();
$reg->select();
?>