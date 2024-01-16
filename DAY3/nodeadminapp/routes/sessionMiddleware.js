exports.isLoggedIn = (req, res, next) => {
    if(req.session.isLogined != undefined){
       next();
    } else {
      res.redirect('/login');
    }
};


exports.isNotLoggedIn = (req, res, next) => {
    if (req.session.isLogined == undefined){
       next();
    } else {
       res.redirect('/');
    }
};
