const axios = require("axios");
const app = require("express")();
app.use(require("body-parser").json({extended: false}));
app.use((error, req, res, next) => {
    if (error) {
        res.status(500).json({err: "internalError"});
    } else {
        next();
    }
});
app.listen(5000);

app.post("/query", (req, res) => {
    if (req.headers.authorization !== process.env.SECRET) return res.status(401).json({err: "unauthorized"});
    if (req.body.query.length > 500) return res.json({answer: "This is too long to post"});
    res.json({
        results: [
            {
                text: "Post this to Alles",
                data: req.body.query
            }
        ]
    });
});

app.post("/action", (req, res) => {
    if (req.headers.authorization !== process.env.SECRET) return res.status(401).json({err: "unauthorized"});
    if (req.body.data.length > 500) return res.status(400).json({err: "post.content.length"});
    
    try {
        axios.post(`https://1api.alles.cx/v1/post?id=${encodeURIComponent(req.body.user)}`, {
            content: req.body.data
        }, {
            auth: {
                username: process.env.ALLES_ID,
                password: process.env.ALLES_SECRET
            }
        }).catch(err => console.log(err));
    } catch (err) {}
});