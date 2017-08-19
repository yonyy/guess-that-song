const {
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLList,
    GraphQLBoolean,
    GraphQLError,
    GraphQLNonNull
} = require('graphql');
const request = require('request');
const User = require('../db/User');
const Room = require('../db/Room');

var UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User that is dynamically created upon joining',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        username: {
            type: GraphQLString
        },
        score: {
            type: GraphQLInt
        },
        room_id: {
            type: GraphQLID
        }
    })
});

var RoomType = new GraphQLObjectType({
    name: 'Room',
    description: 'Room that users join',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        name: {
            type: GraphQLString
        },
        guests: {
            type: new GraphQLList(UserType),
            resolve: (pv, args, req) => {
                return User.find({ room_id: pv._id}, (err, users) => {
                    if (err) { return new GraphQLError('Non-existent room'); }
                    return users;
                });
            }
        },
        alive: {
            type: GraphQLBoolean
        },
        passcode: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
});

var AccessTokenType = new GraphQLObjectType({
    name: 'AccessToken',
    description: 'Gets an access token from Spotify API Endpoint',
    fields: () => ({
        access_token: {
            type: GraphQLString
        }
    })
});

var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            'User': {
                type: UserType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) }
                },
                resolve: (pv, args, req) => {
                    return User.findById(args.id, (err, user) => {
                        if (err) { return new GraphQLError('Non-existent user'); }
                        return user;
                    });
                }
            },
            'Room': {
                type: RoomType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) }
                },
                resolve: (pv, args, req) => {
                    return Room.findById(args.id, (err, room) => {
                        if (err) { return new GraphQLError('Non-existent room'); }
                        return room;
                    });
                }
            },
            'AccessToken': {
                type: AccessTokenType,
                resolve: (pv, args, req) => {
                    return request.post({
                        uri: '/api/spotify/access_token'
                    }, (err, res) => {
                        if (err) {
                            return new GraphQLError(err);
                        }
                        console.log('here', res);
                        return { access_token: res.body.access_token };
                    });
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutationType',
        fields: {
            'createRoom': {
                type: RoomType,
                description: 'Dynamically create a room',
                args: {
                    userId: { type: new GraphQLNonNull(GraphQLID) }
                },
                resolve: (pv, { userId }, req) => {
                    return Room.create({ guests: [userId] }, (err, room) => {
                        if (err) { return new GraphQLError('Error creating room'); }
                        return User.findById(userId, (err, user) => {
                            user.room_id = room._id;
                            user.save();
                            return room;
                        });
                    });
                }
            },
            'joinPublicRoom': {
                type: RoomType,
                description: 'User trying to join a room',
                args: {
                    roomId: { type: new GraphQLNonNull(GraphQLID) },
                    userId: { type: new GraphQLNonNull(GraphQLID) }
                },
                resolve: (pv, { userId, roomId }, req) => {
                    Room.findById(roomId, (err, room) => {
                        if (err) {
                            return new GraphQLError('Non-existent room');
                        } else {
                            room.guests.append(userId);
                            room.save();
                            return room;
                        }
                    });
                }
            },
            'joinPrivateRoom': {
                type: RoomType,
                description: 'User trying to join private room',
                args: {
                    userId: { type: new GraphQLNonNull(GraphQLID) },
                    passcode: { type: GraphQLString }
                },
                resolve: (pv, { userId, passcode }, req) => {
                    Room.findOne({ passcode }, (err, room) => {
                        if (err) {
                            return new GraphQLError('Invalid passcode');
                        } else {
                            room.guests.append(userId);
                            room.save();
                            return room;
                        }
                    });
                }
            },
            'createUser': {
                type: UserType,
                description: 'Dynamically creating user',
                args: {
                    username: { type: GraphQLString }
                },
                resolve: (pv, {username}, req) => {
                    return User.create({username});
                }
            }
        }
    })
});

module.exports = schema;
