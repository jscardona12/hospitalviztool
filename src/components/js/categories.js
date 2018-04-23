const d3 = require('d3');
const vega = require('vega');
const  moment = require('moment');


export function getCategories(data, attr,callback) {
    console.log("Geting categories");
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

export function binTemp(data,attr){
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
    var cate = Object.entries(cat);
    console.log("Creating Bin");
    var len = cate.length;
    cate.sort(function(a,b){
       return moment(a[0], 'MM-DD-YYYY HH:mm:ss').diff(moment(b[0], 'MM-DD-YYYY HH:mm:ss'));
    });
    var first = moment(cate[0][0], 'MM-DD-YYYY HH:mm:ss').format('L');
    var last  = moment(cate[len-1][0], 'MM-DD-YYYY HH:mm:ss').format('L');
    var binArr = [first];
    var temp = moment(cate[0][0], 'MM-DD-YYYY HH:mm:ss');
    console.log(temp.diff(moment(cate[len-1][0], 'MM-DD-YYYY HH:mm:ss')));
    while(temp.diff(moment(cate[len-1][0], 'MM-DD-YYYY HH:mm:ss')) < 0){
        temp.add(1,'month');
        var a = temp.format('L');
        binArr.push(a);
    }
    console.log(binArr);
    var bin = {};
    var i = 0;
    var j = 0;
    while(i < binArr.length && j < cate.length){
        var ind = binArr[i];
        var k = cate[j][0];
        var m = moment(k, 'MM-DD-YYYY HH:mm:ss')
        var e = cate[j][1];
        if(!bin[ind]){
            bin[ind]= e;
            j ++;
            continue;
        }
        else if(moment(binArr[i + 1],"MM-DD-YYYY").diff(m)>0){
            bin[ind]= bin[ind] + e;
            j ++;
            continue;
        }
        else if(moment(binArr[i + 1],"MM-DD-YYYY").diff(m)<=0){
            i ++;
            continue;
        }
    }
    console.log(bin);
    var bine = bin;
    // console.log(catArr);
    // console.log(Object.entries(cat));
    bin = Object.entries(bin);
    bin.sort(function(a, b){return moment(a[0],"MM-DD-YYYY").diff(moment(b[0],"MM-DD-YYYY"))});
    var ret = [bin];
    if(bin.length > 20){
        ret = [];
        var temp1 = [];
        var count = 0;
        bin.map(d =>{
            if(count ==20){
                ret.push(temp1);
                temp1 = [];
                temp1.push(d);
                count = 1;
            }
            else{
                count ++;
                temp1.push(d);
            }
        })
    }
    return [bine,ret];
}

export function binQuant(data,attr){

}

export function getRelationsTemp(data,keys,attr,callback){
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