const d3 = require('d3');
const vega = require('vega');


export function getCategories(data, attr,callback) {
    var catArr =[];
    var cat ={}
    var categories = data.forEach((d)=>{
        var val = d[attr];
        if(!cat[val]) {
            cat[val] = 1;
            catArr.push(val);
        }
        else{
            cat[val] ++;
        }
    })
    // console.log(catArr);
    // console.log(Object.entries(cat));
    cat = Object.entries(cat);
    cat.sort(function(a, b){return b[1]-a[1]});
    var ret = cat;
    if(cat.length > 10){
        ret = [];
        var temp = [];
        var count = 0;
        cat.map(d =>{
            if(count ==10){
                ret.push(temp);
                temp = [];
                temp.push(d);
                count = 1;
            }
            else{
                count ++;
                temp.push(d);
            }
        })
    }
    return ret;
 }
