
function parseEditPost(data){
    const updatedData = {};
    if (data.title){
        updatedData.title = data.title;
    }
    if (data.text){
        updatedData.text = data.text;
    }
    if (data.isPublished){
        const isPub = data.isPublished == 'true' ? true : false;
        updatedData.isPublished = isPub;
        updatedData.createdAt = new Date();
    }
    return updatedData;
}

module.exports =[parseEditPost];