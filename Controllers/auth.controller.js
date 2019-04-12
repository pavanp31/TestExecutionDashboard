

function AuthController(){
    function isAuthorized(roles,neededRole){
        return roles.indexOf(neededRole)>=0;
    }
    return {isAuthorized};
}

module.exports = AuthController();