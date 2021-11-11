const { AuthenticationError } = require('apollo-server-express');
const { User, Shifts, Location, Shift } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
  Query: {
    locations: async () => {
      return await Location.find();
    },
    shifts: async (parent, { location, name }) => {
      const params = {};

      if (location) {
        params.location = location;
      }

      if (name) {
        params.name = {
          $regex: name
        };
      }

      return await Shifts.find(params).populate('location');
    },
    product: async (parent, { _id }) => {
      return await Shifts.findById(_id).populate('location');
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'shift.shifts',
          populate: 'location'
        });

        user.shift.sort((a, b) => b.shiftDate - a.shiftDate);
        // order= shift   shifts=product // 
        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'shift.shifts',
          populate: 'location'
        });

        return user.orders.id(_id);
      }

      throw new AuthenticationError('Not logged in');
    },
    // checkout: async (parent, args, context) => {
    //   const url = new URL(context.headers.referer).origin;
    //   const shift = new Shift({ shifts: args.shifts });
    //   const line_items = [];

    //   const { Shifts } = await order.populate('shifts').execPopulate();

    //   for (let i = 0; i < shifts.length; i++) {
    //     const shifts = await stripe.shifts.create({
    //       name: products[i].name,
    //       description: products[i].description,
    //       images: [`${url}/images/${products[i].image}`]
    //     });

    //     const price = await stripe.prices.create({
    //       product: product.id,
    //       unit_amount: products[i].price * 100,
    //       currency: 'usd',
    //     });

    //     line_items.push({   THIS IS WERE ON THE BACK END IT WILL PUT PICKED DAYS ON CALENDAR
    //       price: price.id,
    //       quantity: 1
    //     });
    //   }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`
      });

      return { session: session.id };
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addShift: async (parent, { shifts }, context) => {
      console.log(context);
      if (context.user) {
        const shift = new Shift({ shifts });

        await User.findByIdAndUpdate(context.user._id, { $push: { shift: shift } }); //orders order

        return shift;
      }

      throw new AuthenticationError('Not logged in');
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },
    updateShifts: async (parent, { _id, quantity }) => {
      const decrement = Math.abs(quantity) * -1;

      return await Shifts.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    }
  }
};

module.exports = resolvers;
