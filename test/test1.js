   var assert = require('assert');
   
    describe('basic mocha test',function(){
        it('should throw error',function(){
            try
            {
                throw({message:'throw error'});
                assert.equal(2,3);
            }
            catch(e)
            {
                console.log(e);
            }
        })
    });

describe('Array',function(){
    describe('#indexof()',function(){
        it('should return -1 when the value is not present ', function(){
            print([1,2,3].indexOf(2));
            assert.equal([1,2,3].indexOf(2),2);
        });
    });
});