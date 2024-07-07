<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");


class Constants
{
    static $DB_SERVER="localhost";
    static $DB_NAME="ecommerce";
    static $USERNAME="root";
    static $PASSWORD="";

    static $SQL_SELECT_ALL="SELECT * FROM products";
    static $SQL_SELECT_BY_ID="SELECT * FROM products WHERE id=?";
}

class Register
{

    public function connect()
    {
        $con=new mysqli(Constants::$DB_SERVER,Constants::$USERNAME,Constants::$PASSWORD,Constants::$DB_NAME);
        if($con->connect_error)
        {
            return null;
        }else
        {
            return $con;
        }
    }
    
    public function selectAll()
    {
        $con=$this->connect();
        if($con != null)
        {
            $result=$con->query(Constants::$SQL_SELECT_ALL);
            if($result->num_rows>0)
            {
                $reg=array();
                while($row=$result->fetch_array())
                {
                    array_push($reg, array("id"=>$row['id'],"name"=>$row['name'],"description"=>$row['description'],"category"=>$row['category'],"details"=>$row['details'],"price"=>$row['price'],"image"=>$row['image'] ,"image1"=>$row['image1'] ,"image2"=>$row['image2'],"image3"=>$row['image3']));
                }
                print(json_encode(array_reverse($reg)));
            }else
            {
                print(json_encode(array("No records found")));
            }
            $con->close();

        }else{
            print(json_encode(array("PHP EXCEPTION : CAN'T CONNECT TO MYSQL. NULL CONNECTION.")));
        }
    }

    public function selectById($id)
    {
        $con=$this->connect();
        if($con != null)
        {
            $stmt = $con->prepare(Constants::$SQL_SELECT_BY_ID);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if($result->num_rows > 0)
            {
                $row = $result->fetch_assoc();
                print(json_encode(array("id"=>$row['id'],"name"=>$row['name'],"description"=>$row['description'],"details"=>$row['details'], "category"=>$row['category'],"price"=>$row['price'],"image"=>$row['image'] ,"image1"=>$row['image1'] ,"image2"=>$row['image2'],"image3"=>$row['image3'])));
            }
            else
            {
                print(json_encode(array("message" => "Product not found")));
            }
            $stmt->close();
            $con->close();
        }
        else
        {
            print(json_encode(array("message" => "PHP EXCEPTION : CAN'T CONNECT TO MYSQL. NULL CONNECTION.")));
        }
    }
}

$reg=new Register();

// Check if 'id' parameter is set in the URL
if(isset($_GET['id'])) {
    $id = $_GET['id'];
    $reg->selectById($id);
} else {
    $reg->selectAll();
}
