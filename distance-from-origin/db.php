<?php

$config = parse_ini_file('/home/davidlan/public_html/secrets/db.ini');
$mysqli = new mysqli($config['host'], $config['user'], $config['password'], $config['db']);
$addresses = array();

if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$query = "SELECT
	Concat(last_name, ', ', first_name) as fullname,
	Concat(
		street_address, ' ', city,
		' ', state, ' ',
		zip
	) as address
FROM
	`google_maps_addresses`
WHERE
	id = 1;";

$query .= "SELECT
	Concat(last_name, ', ', first_name) as fullname,
	Concat(
		street_address, ' ', city,
		' ', state, ' ', zip
	) as address
FROM
	`google_maps_addresses`
WHERE
	id != 1";

$i = 0;
if ($mysqli->multi_query($query)) {
	do {
		if ($result = $mysqli->store_result()) {
			while ($row = $result->fetch_row()) {
				// array_push($addresses, $row);
				$addresses[$i] = array('name' => $row[0], 'address' => $row[1]);
				$i++;
			}
			$result->free();
		}
	} while ($mysqli->next_result());
}

echo json_encode($addresses);