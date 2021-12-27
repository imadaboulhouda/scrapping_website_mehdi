const fs = require('fs');
const converter = require('json-2-csv');
const {getData} = require('./functions')
const arrayLink = ["https://playfun.ma/categorie-produit/high-tech/","https://playfun.ma/categorie-produit/jeux-educatifs/","https://playfun.ma/categorie-produit/univers-bebe/","https://playfun.ma/categorie-produit/jeux-et-jouets/","https://playfun.ma/categorie-produit/plein-air/","https://playfun.ma/categorie-produit/age/","https://playfun.ma/categorie-produit/marque/","https://playfun.ma/deals-promo/"];


(async()=>{
    for(var x = 0;x<=arrayLink.length;x++)
{       let name=arrayLink[x].split("/");
    name = (name[name.length - 2])
    arrayListe = [];
    var arrayListe =  await getData(arrayLink[x]);
  
     converter.json2csv(arrayListe, (err, csv) => {
            if (err) {
                throw err;
            }
        
            // print CSV string
            fs.writeFileSync(name+'.csv', csv);
        });
    
}})()

console.log("Done Good Luck")