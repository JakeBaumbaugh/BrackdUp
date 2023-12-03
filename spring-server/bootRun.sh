# echo $GOOGLE_CLIENT_ID
# echo $GOOGLE_CLIENT_SECRET
gradle -Dgoogle.client.id=$GOOGLE_CLIENT_ID -Dgoogle.client.secret=$GOOGLE_CLIENT_SECRET clean bootRun