const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing")

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mailchimp.setConfig({
    apiKey: "MYAPIKEY",
    server: "MYSERVERPREFIX",
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});



app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const listID = "64065df93e";
    const subscriber = {
        firstName: firstName,
        lastName: lastName,
        email: email,
    };
    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listID, {
                email_address: subscriber.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscriber.firstName,
                    LNAME: subscriber.lastName
                }
            });
            console.log(`Successfully added contact as an audience member. The contact's ID is ${response.id}.`);
            res.sendFile(__dirname + "/success.html");
        } catch (e) {
            res.sendFile(__dirname + "/failure.html");
        };
    };

    run();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
});


