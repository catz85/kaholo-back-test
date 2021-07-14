const { withFilter, PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const { spawn, exec } = require('child_process');
const resolvers = {
    Query: {
        messages: async (root, args, { sequelize: { models } }) => {
            const messages = await models.message.findAll({ order: [['createdAt', 'DESC']] }, { raw: true });
            return messages
        }
    },
    Mutation: {
        createMessage: async (root, args, { sequelize: { models } }) => {
            const data = await new Promise((resolve, reject) => {
                exec(args.text, (err, stdout, stderr) => {
                    if (err) {
                        return resolve(stderr);
                    }
                    return resolve(stdout)
                });
            });
            const message_to_save = { command: args.text, text: data };
            let message;
            try {
                message = await models.message.create(message_to_save);
                pubsub.publish('messages', {messages:message});
                return message;
            } catch (error) {
                console.log(error);
                return { command: args.text, error: error };
            }
        }
    },
    Subscription: {
        messages: {
            subscribe: () => pubsub.asyncIterator('messages')
        }
    }
}

module.exports = resolvers;