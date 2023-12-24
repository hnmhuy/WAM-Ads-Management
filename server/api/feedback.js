const controller = {};

controller.reCaptcha = (req, res) => {
    const params = new URLSearchParams({
        secret: "6Lf3MDopAAAAAE617VRXJ87gQ_4fdmksat-yKfB6",
        response: req.body["g-recaptcha-response"],
        remoteip: req.ip,
    });

    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: params,
    })
        .then((res) => res.json())
        .then((data) => {
        if (data.success) {
            res.json({ captchaSuccess: true });
        } else {
            res.json({ captchaSuccess: false });
        }
        });

}

controller.sendFeedback = (req, res) =>
{
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    console.log(req.body);
    console.log(req.file);
    res.json({ message: 'Received feedback successfully!' });

}

module.exports = controller;