import mongoose, { Schema, model } from "mongoose";

const employeesSchema = new Schema(
  {
    name: {
      type: String,
    },

    lastName: {
      type: String,
    },

    username: {
      type: String,
    },

    email: {
      type: String,
    },

    gmail: {
      type: String,
    },

    password: {
      type: String,
    },

    phone: {
      type: String,
    },

    DateContract: {
      type: Date,
    },

    contractDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
    },

    Status: {
      type: String,
    },

    state: {
      type: Boolean,
    },

    timeOut: {
      type: Date,
    },

    loginAttempts: {
      type: Number,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Employees", employeesSchema, "Employees");