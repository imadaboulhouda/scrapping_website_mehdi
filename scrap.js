const cherrio = require('cheerio');
const fs = require('fs');
const converter = require('json-2-csv');

const arrayLink = ["https://playfun.ma/categorie-produit/high-tech/","https://playfun.ma/categorie-produit/jeux-educatifs/","https://playfun.ma/categorie-produit/univers-bebe/","https://playfun.ma/categorie-produit/jeux-et-jouets/","https://playfun.ma/categorie-produit/plein-air/","https://playfun.ma/categorie-produit/age/","https://playfun.ma/categorie-produit/marque/","https://playfun.ma/deals-promo/"];

const axios = require('axios');

const getDataImageItem = async(url) =>{

    let data = await axios.get(url,{
        headers:{
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
        }
    });
    data = data.data;
    const $ = cherrio.load(data);
    let items = [];
    $(".product-images-wrapper img").each(function(__,v){
        items.push($(v).attr('src'));
    });
    return await items.join("##");
};


const getData = async (url)=>{

let data = await axios.get(url,{
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    }
});

data  = await data.data;


const $ = cherrio.load(data);


var dataX = [];
for(var i=0;i< $("ul.products li.product").length;i++)
{   
    let v = $("ul.products li.product")[i];
         let lien  = $(v).find('a').attr('href') || "";
        let images = await getDataImageItem(lien);
    let dataImages = {
        image_principal:$(v).find('.product-thumbnail img').attr('src'),
        title:$(v).find('.woocommerce-loop-product__title').text(),
        price:$(v).find('ins .amount').text().length > 0 ? $(v).find('ins .amount').text() : $(v).find(".amount").text(),
        lien,
        images:images,
    };

    console.log(dataImages);
    dataX.push(dataImages);
}

return dataX;


};
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