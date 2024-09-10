
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');



async function findUser(colName, query){

    try{
        const whereCase = { [colName]: query };
        const user = await prisma.user.findUnique({
            where: whereCase
        })

        return user;
    } catch (error) {
        console.error(`Error finding user:`, error);
        throw error;
    }
}

async function signUp(signer) {
    try {
        const hash = await bcrypt.hash(signer.password, 10); // "Salting" - safe method against attack.

        const user = await prisma.user.create({
            data: {
                username: signer.username,
                email: signer.email,
                password: hash,
            }
        });
        console.log("User created successfully:", user);
        return user;
    } catch (error) {
        console.error('Error creating user', error);
        throw error;
    }
}

async function getAllPosts(){
    try{
        const posts = await prisma.post.findMany();
        return posts;
    } catch(error) {
        console.error('Error fetching posts', error);
        throw error;
    }
}

async function getPostById(postId){
    try{
        const post = await prisma.post.findUnique({
            where: {id: postId},
        });
        return post;
    } catch(error) {
        console.error(`Error fetching post id: '${postId}' from database: `, error);
        throw error;
    }
}

async function createPost(title, text, authorId){
    try {
        
        const post = await prisma.post.create({
            data: {
                title: title,
                text: text,
                authorId: authorId,
            }
        });
        console.log("Post inserted correctly in db:", post);
        return post;
    } catch (error) {
        console.error('Error creating post', error.message);
        throw error;
    }
}

async function updatePost( postId, newData){
    try{
        const post = await prisma.post.update({
            where: {
                id: postId
            },
            data: newData,
        });
        return post;
        
    } catch(error) {
        console.error('Error updating post', error);
        throw error;
    }
}

async function deletePost(postId){
    try{
        const post = await prisma.post.delete({
            where: {
                id: postId
            }
        });
        return post;
    } catch(error) {
        console.error('Error deleting post', error);
        throw error;
    }
}


// CRUD functions for comments
async function getAllComments(){
    try{
        const comments = await prisma.comment.findMany();
        return comments;
    } catch(error) {
        console.error('Error fetching comments', error);
        throw error;
    }
}

async function getCommentsOfPost(postId){
    try{
        const comments = await prisma.comment.findMany({
            where: {parentId: postId},
            include: {
                commenter: true
            }
        });
        return comments;
    } catch(error) {
        console.error(`Error fetching comments from database: `, error);
        throw error;
    }
}

async function createComment( text, commenterId, parentId){
    try {
        
        const comment = await prisma.comment.create({
            data: {
                text: text,
                commenterId: commenterId,
                parentId: parentId,
            }
        });
        console.log("Comment inserted correctly in db:", comment);
        return comment;
    } catch (error) {
        console.error('Error creating comment', error);
        throw error;
    }
}

async function updateComment( commentId, text){
    try{
        const updatedComment = await prisma.comment.update({
            where: {
                id: commentId
            },
            data: {
                text: text,
                createdAt: new Date(),
            }
        });
        return updatedComment;
        
    } catch(error) {
        console.error('Error updating post', error);
        throw error;
    }
}

async function deleteComment(commentId){
    try{
        const comment = await prisma.comment.delete({
            where: {
                id: commentId
            }
        });
        return comment;
    } catch(error) {
        console.error('Error deleting comment', error);
        throw error;
    }
}


async function makeAdmin(username){
    try{
        const user = await prisma.user.update({
            where: { username: username },
            data: { type: 'Admin' }
        });
        return user;
    } catch(error) {
        console.error('Error updating user role:', error);
        throw error;
    }
}



module.exports = {
    findUser,
    signUp,
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getAllComments,
    getCommentsOfPost,
    createComment,
    updateComment,
    deleteComment,
    makeAdmin
};