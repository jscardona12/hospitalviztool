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
        var fin = cat[cat.length-1]
        cat.map(d =>{
            if(count ==10){
                ret.push(temp);
                temp = [];
                temp.push(d);
                count = 1;
            }
            else if(d === fin){
                temp.push(d);
                ret.push(temp);
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
    // cate.sort(function(a,b){
    //    return moment(a[0], 'MM-DD-YYYY HH:mm:ss').diff(moment(b[0], 'MM-DD-YYYY HH:mm:ss'));
    // });
    var max =  moment(cate[0][0], 'MM-DD-YYYY HH:mm:ss');
    var min =  moment(cate[0][0], 'MM-DD-YYYY HH:mm:ss');
    cate.forEach((k,e)=>{
        var t = moment(k, 'MM-DD-YYYY HH:mm:ss');
        if(t.diff(max)>0){
         max = t;
        }
        if(t.diff(min)<0){
            min = t;
        }
    })
    var first = min.format('L');
    var last  = max.format('L');
    var binArr = [first];
    var temp = min;
    console.log(temp.diff(moment(cate[len-1][0], 'MM-DD-YYYY HH:mm:ss')));
    while(temp.diff(max) < 0){
        temp.add(1,'month');
        var a = temp.format('L');
        binArr.push(a);
    }
    console.log(binArr);
    var bin = {};
    var i = 0;
    var j = 0;
    while(j < cate.length){
        var val = cate[j][0];
        var m = moment(val, 'MM-DD-YYYY HH:mm:ss');
        var e = cate[j][1];
        for(var i=0; i < binArr.length -1; i++){
            var ind = binArr[i];
            if(!bin[ind]){
                bin[ind]= 0;

            }
            // console.log(moment(val, 'MM-DD-YYYY HH:mm:ss').diff(moment(bins[i], 'MM-DD-YYYY'))>=0);
            // console.log(moment(val, 'MM-DD-YYYY HH:mm:ss').diff(moment(bins[i+1], 'MM-DD-YYYY'))<0);
            if(moment(val, 'MM-DD-YYYY HH:mm:ss').diff(moment(binArr[i], 'MM-DD-YYYY'))>=0 && moment(val, 'MM-DD-YYYY HH:mm:ss').diff(moment(binArr[i+1], 'MM-DD-YYYY'))<0){

                    bin[ind]= bin[ind] + e;
                    j ++;

                break;
            }
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
        var fin = bin[bin.length -1];
        bin.map(d =>{
            if(count ==20){
                ret.push(temp1);
                temp1 = [];
                temp1.push(d);
                count = 1;
            }
            else if(d === fin){
                temp1.push(d);
                ret.push(temp1);
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

export function getRelationsTemp(data,keys,attr,bins,callback){
    console.log("Geting relations ...")
    var catArr =[];
    var cat ={};
    var arr ={};
    data.forEach((d)=>{
        var val = d[attr];
        for(var i=0; i < bins.length -1; i++){
            // console.log(moment(val, 'MM-DD-YYYY HH:mm:ss').diff(moment(bins[i], 'MM-DD-YYYY'))>=0);
            // console.log(moment(val, 'MM-DD-YYYY HH:mm:ss').diff(moment(bins[i+1], 'MM-DD-YYYY'))<0);
            if(moment(val, 'MM-DD-YYYY HH:mm:ss').diff(moment(bins[i], 'MM-DD-YYYY'))>=0 && moment(val, 'MM-DD-YYYY HH:mm:ss').diff(moment(bins[i+1], 'MM-DD-YYYY'))<0){
                val = bins[i]
                break;
            }
        }
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