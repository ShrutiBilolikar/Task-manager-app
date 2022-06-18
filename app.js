const express = require("express");
const bodyParser = require("body-parser");
"use strict";
const nodemailer = require("nodemailer");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
var items = [];
var workItems = [];
var users = [];
var usersEmail = [];
var item1;
var item2;

app.get("/", function (req, res) {   //kuchbhi agar home route me jake add krna hai toh app.get se changes krne honge post me change karoge toh reflect nai honge
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US", options);
    // var currentday = today.getDay;
    // var day = "";
    // if (currentday === 6 || currentday === 0) {
    // day = "Weekend";
    // }
    // else {
    // day = "Weekday";
    // }
    res.render("list", { kindOfDay: day, newListItems: items });           // kindOfDay--js object key value pair & list is the ejs file in views folder
    // basically says render a file called list & pass that file to a variable called kindOfDay
    // value is going to be equal to value of day
});

app.get("/work", function (req, res) {
    res.render("list", { kindOfDay: "Work List", newListItems: workItems });
});
app.get("/SignUp", function (req, res) {
    res.render("user", { signup: "SIGN UP", newUser: users, newUserMail: usersEmail });
});
app.post("/", function (req, res) {
    let item = req.body.newItem;
    let item1 = req.body.newName;
    let item2 = req.body.newEmail;
    if (req.body.list === "work") {
        workItems.push(item);
        res.redirect("/work");
    }
    else {
        //we need to redirect this to home route
        items.push(item);
        res.redirect("/");
    }
});
app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});
app.post("/SignUp", function (req, res) {
    let item1 = req.body.newName;
    users.push(item1);
    let item2 = req.body.newEmail;
    usersEmail.push(item2);
    res.redirect("/");
    console.log(item1);
    console.log(item2);

    async function main() {
        let testAccount = await nodemailer.createTestAccount()
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '<shrutibilolikar2003@gmail.com>', // sender address
            to: `${item2}`, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    main().catch(console.error);
});
app.listen(3000, function () {
    console.log("server started at port 3000");
});