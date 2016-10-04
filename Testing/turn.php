<!DOCTYPE html>

<html>
<head>
    <title>Page Title</title>
</head>

<body>

<?php
$host = 'mysql.serversfree.com';
$user = 'u139246078_cribb';
$pass = 'qwerasdf';
$db = 'u139246078_cribb';
$handle = mysql_connect($host,$user,$pass);
if($handle) {
    mysql_select_db($db,$handle);
}

$query = "SELECT * FROM Cribbage WHERE game = 0";
$result = mysql_query($query);
$results;
if($result) {
$results = array();
        while($r = mysql_fetch_array($result)) {
                $results[] = $r;
        }
}
print_r($results);
?>                  

</body>
</html>
