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
var OraDBPackageSchema = new Schema({

  // same for all versions
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Package name is required'
  },

  // can be different for a version
  description: {
    type: String,
    default: '',
    trim: true,
    required: 'Description name is required'
  },

  // stable, beta, ...
  tags: {
    // TODO: srsly?
    // TODO: Did you try nesting Schemas? You can only nest using refs or arrays.

    //latest: {
    //  type: String,
    //  default: '',
    //  trim: true,
    //  required: 'Tag "latest" is required'
    //}
  },

  versions: [
    {
      // TODO: srsly?
      // TODO: Did you try nesting Schemas? You can only nest using refs or arrays.

      //version: {
      //  Type: String,
      //  default: '',
      //  trim: true,
      //  required: 'Package version in versions is required'
      //},
      //url: {
      //  Type: String,
      //  default: '',
      //  trim: true,
      //  required: 'Package version url is required'
      //}
    }
  ],

  // array of "username <email>"
  maintainers: [String],

  // time info
  time: {
    // last version

    // TODO: srsly?
    // TODO: Did you try nesting Schemas? You can only nest using refs or arrays.

    //modified: {
    //  type: Date,
    //  default: Date.now()
    //},
    //// publish
    //created: {
    //  type: Date,
    //  default: Date.now()
    //}
    //"version" : "created" //(Date.now()),
    //"version" : "created" //(Date.now()),
    //"version" : "created" //(Date.now()),
    //"version" : "created" //(Date.now())
  },

  // "firstName lastName <email>"
  author: {
    type: String,
    default: '',
    trim: true,
    required: 'Package author is required'
  },

  // technical attributes
  authorId: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  // only git supported now
  repository: {
    // TODO: srsly?
    // TODO: Did you try nesting Schemas? You can only nest using refs or arrays.

    //url: {
    //  Type: String,
    //  trim: true,
    //  default: '',
    //  required: 'Package repository is required'
    //}
  },

  // latest version
  version: {
    type: String,
    default: '',
    trim: true,
    required: 'Version cannot be empty'
  },

  license: {
    type: String,
    default: ''
  },

  keywords: [{
    type: String,
    trim: true
  }],

  // release notes
  notes: {
    type: String,
    default: '',
    trim: true
  }

  //// technical attributes
  //userId: {
  //  type: Schema.ObjectId,
  //  ref: 'User'
  //},
  //
  ////TODO: update on change
  ////stored user data
  //user: {},

  //created: {
  //  type: Date,
  //  default: Date.now
  //}
});

// fulltext index on name/description/keywords
OraDBPackageSchema.index({
  name: 'text',
  description: 'text',
  keywords: 'text'
});

// unique name/version index
OraDBPackageSchema.index({name: 1}, {unique: true});

mongoose.model('OraDBPackage', OraDBPackageSchema);
