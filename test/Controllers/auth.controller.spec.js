var assert = require('assert');

var authController = require('..\\..\\Controllers\\auth.controller.js');

describe('AuthController',function(){
    describe('isAuthorized',function()
{
    it('should return false if not authorized',function()
    {
         assert.equal(false,authController.isAuthorized(['user'],'admin'));
    });
    it('should return false if not authorized',function(){
        assert.equal(true,authController.isAuthorized(['user','admin'],'admin'));
    });
    });
});