const allowedUsers = {
  "asergeev@flo.team": "jgF5tn4F",
  "vkotikov@flo.team": "po3FGas8",
  "tpupkin@flo.team": "tpupkin@flo.team",
};

exports.login = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });


  req.on("end", () => {
    const user = JSON.parse(body);
    const email = user.email;
    const password = user.password;

    if (allowedUsers.hasOwnProperty(user.email) && user.password === allowedUsers[user.email]) {
      res.end(JSON.stringify({ token: "token" }));
    } else {
      res.statusCode = 401;
      res.end(JSON.stringify({ errorMessage: "Unauthorized" }));
    }
  });
};
