const postsModel = require('../../models/posts/posts.model');


module.exports = {
    Query: {
        post: async(_, { _id }) => {
            return await postsModel.getPostById(_id); 
        },
        posts: async(_, { offset, limit }) => {
            return {
                posts: await postsModel.getAllPosts({ offset, limit }),
                count: await postsModel.getDocsCount({}),
            }
        },
        postsByOwner: async(_, { owner, offset, limit }) => {
            return {
                posts: await postsModel.getAllWithOwnerId(owner,{ offset, limit }),
                count: await postsModel.getDocsCount({ owner }),
            }
        },
        postsSavedByUser: async(_, { user, offset, limit }) => {
            return {
                posts: await postsModel.getSavedPostsByUserId(user, { offset, limit }),
                count: await postsModel.getDocsCount({ savedBy: user }),
            }
        },
        postsByTitle: async(_, { input }) => {
            const { userId, title, userIsOwner } = input;

            let posts;
            if (userId) {
                posts = await postsModel.getByTitleWithUserId(title, userIsOwner, userId);
            } else {
                posts = await postsModel.getByTitle(title);
            }
            return posts;
        },
        postsByIds: async(_, { ids }) => {
            return await postsModel.getManyByIds(ids);
        },
        postsMostPopular: async(_, { date }) => {
            return await postsModel.getMostPopularPostsByStartDate(new Date(date));
        },
        postsByCategory: async(_, { category, offset, limit }) => {
            return await postsModel.getPostsByCategory(category, { offset, limit });
        }
    },
    Mutation: {
        postCreate: async(_, { input }) => {
            let createdPost;
            await postsModel.addPost(input)
                .then(data => {
                    createdPost = data[0];
                });
            return createdPost;
        },
        postUpdate: async(_, { input }) => {
            const { post, value, what } = input;
            return await postsModel.updatePost(post, value, what);
        },
        postDeleteById: async(_, { _id }) => {
            return await postsModel.deletePostById(_id);
        },
        postSwitchLike: async(_, { input }) => {
            const { userId, postId } = input;
            return await postsModel.switchIsLiked(postId, userId);
        },
        postSwicthInSaved: async(_, { input }) => {
            const { userId, postId } = input;
            return await postsModel.switchInSaved(postId, userId);
        }
    }
}