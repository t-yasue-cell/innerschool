import { Injectable } from '@nestjs/common';

@Injectable()
export class MexeasyService {
    public sortlist(index: number, data:any){
        const datakeys = Object.keys(data[0]);
        data.sort((a,b)=>{
            if (typeof a[datakeys[index]] === "string" && typeof b[datakeys[index]] === "string"){
                return a[datakeys[index]].localeCompare(b[datakeys[index]]);
            } else {
                return a[datakeys[index]] - b[datakeys[index]];
            }
        });
        return data;
    }
    public compression(index: number, data:any): any{
        const datakeys = Object.keys(data[0]);
        for(let i = 0; i < data.length; i++){
            const getdata: any = data[i][datakeys[index]];
            for(let j = i+1; j<data.length; j++){
                if(data[j][datakeys[index]] == getdata){
                    for(let k = 0;k < datakeys.length ;k++){
                        if(data[i][datakeys[k]] != data[j][datakeys[k]]){
                            data[i][datakeys[k]] = data[i][datakeys[k]]+ "\n" + data[j][datakeys[k]];
                        }
                    }
                    data.splice(j,1);
                    j=j-1;
                }
            }
        }
        return data;
    }
}
