const express = require('express');
const queryString = require('query-string');
const app = express();
const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   password: 'password'
  },
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   password: 'password'
  },
  {id: 3,
   firstName: 'Lila',
   lastName: 'LeMonde',
   userName: 'lila@business.com',
   position: 'Growth Hacker',
   isAdmin: false,
   password: 'password'
  },
  {id: 4,
   firstName: 'Freddy',
   lastName: 'Fun',
   userName: 'freddy@business.com',
   position: 'Community Manager',
   isAdmin: false,
   password: 'password'
  }
];

//  3. looks for a user object matching the sent username and password values
//  4. if matching user found, add the user object to the request object
//     (aka, `req.user = matchedUser`)
// middleware function
function gateKeeper(req, res, next) {
  // looks for user object matching the sent username and password values
  let header = req.get('x-username-and-password');
  // parses the value for user and pass.
  let parsedHeader = queryString.parse(header);
  const user = parsedHeader.user || null;
  const pass = parsedHeader.pass || null;
  // Using find, look for user matching the username and password values.
  req.user = USERS.find((usr,index) => usr.userName === user  && usr.password === pass);
  next();
}
// Middleware
app.use(gateKeeper);
// this endpoint returns a json object representing the user making the request,
// IF they supply valid user credentials. This endpoint assumes that `gateKeeper` 
// adds the user object to the request if valid credentials were supplied.
app.get("/api/users/me", (req, res) => {
  // send an error message if no or wrong credentials sent
  /*403 -> 401 Usual User Error. */
  if (req.user === undefined) {
    return res.status(401).json({message: 'Must supply valid user credentials'});
  }
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});

app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});
