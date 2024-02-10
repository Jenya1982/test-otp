1) For to start to work on an app in main folder: npm start
2) Prerequisites: PostgreDB, Generated on GoogleOne Accounts 2-step pass for apps for to send mails from gmail
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The roadmap of an app:
on the main screen (react) user inputs his/her email and click button "Receive OTP", the query sent to the server (express.js), 
and the otp constructed based on the demands of an app. Then the email of user, generated otp, and timestamp when otp was created
sent all to a database (postgres) table otps. There it stored till the user not used it right (then validation as expected passed and no more need to store the otp) 
or the time range (5 minutes) not passed. If the user has the demanded range but by mistake inputed a wrong otp system will give alert that the otp isn't correct and 
there is must to insert a correct one.
After the user input the otp the system will check if the otp is correct and in a normal range, based on condition user will receive message. 
CRUD system: for to interact with database (database.js) I'll use CRUD system without update part. Create - async function insertOTP(email, otp), Read - async function getOTPByEmail(email)
Delete - async function deleteOTP(email).
Database consists of Two tables (in project implemented only one). First one includes within it the main data about emails, who their owners, etc. 
and other one (implemented) is used for to store timely otps and in this way we have a support table (implemented) that related to main table with mails and other data
but not affected her, and also, no need to deal with null or undefined data that can appear after we'll i.e. store otps forever (no any logic for this).
