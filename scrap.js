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
var arrayListe =[];

const getData = async (url)=>{

let data = await axios.get(url,{
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    }
});

data  = await data.data;


const $ = cherrio.load(data);

$("ul.products li.product").each(async (__,v) =>{
    
    let lien  = $(v).find('a').attr('href') || "";
        
    let dataImages = {
        image_principal:$(v).find('.product-thumbnail img').attr('src'),
        title:$(v).find('.woocommerce-loop-product__title').text(),
        price:$(v).find('ins .amount').text().length > 0 ? $(v).find('ins .amount').text() : $(v).find(".amount").text(),
        lien,
    };


    //  if(lien.length > 0)
    // {
    //     let items =  await getDataImageItem(lien);
    //     dataImages.images = items;

    // }
    

     
        arrayListe.push(dataImages);


    


});




return await arrayListe;
};

let name = "";
let itemData = arrayLink[1];
    name=itemData.split("/");
    name = (name[name.length - 2])
    arrayListe = [];
    
    getData(itemData).then(async function(){
        console.log("Start scrapping with images "+ itemData);
        console.log(name,arrayListe)
        for(let [index,item] of arrayListe.entries())
        {
        
            let images = await getDataImageItem(item.lien);
           
            arrayListe[index].images = images;
        }
        converter.json2csv(arrayListe, (err, csv) => {
            if (err) {
                throw err;
            }
        
            // print CSV string
           console.log(`Csv file  of  ${name} is ${csv}`);
            fs.writeFileSync(name+'.csv', csv);
        });
    });



console.log("done");