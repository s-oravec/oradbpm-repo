'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  textSearch = require('mongoose-text-search'),
  Schema = mongoose.Schema;

/**
 * oradbpackage Schema
 */
var OraDBPackageVersionSchema = new Schema({

  // same for all versions
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Package name is required'
  },

  // latest version
  version: {
    type: String,
    default: '',
    trim: true,
    required: 'Version cannot be empty'
  },

  // git url
  versionUrl: {
    type: String,
    trim: true,
    default: '',
    required: 'Package version url is required'
  },

  // license
  license: {
    type: String,
    default: ''
  },

  // keywords list
  keywords: [{
    type: String,
    trim: true
  }],

  // version notes notes
  notes: {
    type: String,
    default: '',
    trim: true
  },

  // technical attribute
  publisherId: {
    type: Schema.ObjectId,
    ref: 'OraDBPackage'
  },

  //"username <email>"
  publisher: {
    type: String,
    default: '',
    trim: true,
    required: 'Package version publisher is required'
  },

  // publish
  created: {
    type: Date,
    default: Date.now()
  }

});

// unique name/version index
OraDBPackageVersionSchema.index(
  {
    name: 1,
    version: 1
  }, {
    unique: true
  }
);

mongoose.model('OraDBPackageVersion', OraDBPackageVersionSchema);
