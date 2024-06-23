echo "** Creating default ($MYSQL_DEFAULT_DATABASE) and test DBs ($MYSQL_TEST_DATABASE)"

mysql -u root --execute \
"CREATE DATABASE IF NOT EXISTS \`$MYSQL_DEFAULT_DATABASE\`;CREATE DATABASE IF NOT EXISTS \`$MYSQL_TEST_DATABASE\`;"

echo "** Finished creating default and test DBs"