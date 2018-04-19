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
    var cate = cat;
    // console.log(catArr);
    // console.log(Object.entries(cat));
    cat = Object.entries(cat);
    cat.sort(function(a, b){return b[1]-a[1]});
    var ret = [cat];
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
    return [cate,ret];
 }
export function getRelations(data,keys,attr,callback) {
    console.log("Calculating relations");
    var catArr =[];
    var cat ={}
    var arr ={};
    data.forEach((d)=>{
        var val = d[attr];
        //console.log(arr);
        keys.forEach((key)=>{
            var val2 = d[key];
            if(key !== attr){

                if(arr[key]){
                    if(arr[key][val2]){
                        if(arr[key][val2][val])
                            arr[key][val2][val] ++;
                        else
                            arr[key][val2][val] =1;
                    }
                    else{
                        arr[key][val2]={}
                        arr[key][val2][val] =1;
                    }
                }
                else{
                    arr[key] ={};
                    arr[key][val2]={}
                    arr[key][val2][val] =1;
                }
            }
        })
    });
    //console.log(arr);
    return arr;
}
