
function parseEditPost(formBody){
    const updatedData = {};
    if (formBody.title){
        updatedData.title = formBody.title;
    }
    if (formBody.text){
        updatedData.text = formBody.text;
    }
    if (formBody.isPublished){
        const isPub = formBody.isPublished == 'true' ? true : false;
        updatedData.isPublished = isPub;
        updatedData.createdAt = new Date();
    }
    return updatedData;
}

module.exports =[parseEditPost];