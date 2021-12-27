
const axios = require('axios');
const cherrio = require('cheerio');

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

module.exports = {
    getData
}