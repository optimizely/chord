var chord = require('./chord');
var vows = require('vows');
var assert = require('assert');

vows.describe('Chord').addBatch({
    'Adding an exponential key': {
        'should add two small values': function () {
            assert.isTrue(chord.equal_to(chord.add_exp([0,0,0,1], 0), [0,0,0,2]));
        },

        'should add a value smaller than 32 bits': function () {
            assert.isTrue(chord.equal_to(chord.add_exp([0,0,0,0], 12), [0,0,0,4096]));
        },

        'should add a value larger than 32 bits': function () {
            assert.isTrue(chord.equal_to(chord.add_exp([0,0,0,0], 44), [0,0,4096,0]));
        },

        'should carry additions across words': function () {
            assert.isTrue(chord.equal_to(chord.add_exp([2, 0xffffffff], 0), [3, 0]));
        },

        'should carry and wrap': function () {
            assert.isTrue(chord.equal_to(chord.add_exp([0xffffffff, 0xffffffff, 0xffffffff], 0), [0,0,0]))
        }
    },

    'Comparing keys': {
        'should find equal things equal': function () {
            assert.isTrue(chord.equal_to([1,2,3,4], [1,2,3,4]));
        },

        'equality should find differences in least significant word': function () {
            assert.isFalse(chord.equal_to([1,2,3,4], [1,2,3,5]));
        },

        'equality should find differences in most significant word': function () {
            assert.isFalse(chord.equal_to([1,2,3,4], [5,2,3,4]));
        },

        'should compare equal things as less than or equal': function () {
            assert.isTrue(chord.less_than_or_equal([1,2,3,4], [1,2,3,4]));
        },

        'should compare lesser things as less than or equal': function () {
            assert.isTrue(chord.less_than_or_equal([1,2,3,3], [1,2,3,4]));
        },

        'should not compare greater things as less than or equal': function () {
            assert.isFalse(chord.less_than_or_equal([1,2,3,5], [1,2,3,4]));
        },

        'should not compare equal things as less than': function () {
            assert.isFalse(chord.less_than([1,2,3,4], [1,2,3,4]));
        },

        'should compare lesser things as less than': function () {
            assert.isTrue(chord.less_than([1,2,3,3], [1,2,3,4]));
        },

        'should not compare greater things as less than': function () {
            assert.isFalse(chord.less_than([1,2,3,5], [1,2,3,4]));
        },

        'most significant word should take precedence over least for less than': function () {
            assert.isTrue(chord.less_than([1,2,3,4], [2,2,3,3]));
        },

        'specific case that broke for real': function () {
            assert.isTrue(chord.less_than([1195588147,3697448847,138059749,162608140],
                [1456031017,292686529,2153452302,2944297828]));
            assert.isFalse(chord.less_than([1456031017,292686529,2153452302,2944297828],
                [1195588147,3697448847,138059749,162608140]));
        }
    },

    'Testing key ranges': {
        'key is in range': function () {
            assert.isTrue(chord.in_range([2], [1], [3]));
            assert.isTrue(chord.in_half_open_range([2], [1], [3]));
        },

        'key is not in range': function () {
            assert.isFalse(chord.in_range([4], [1], [3]));
            assert.isFalse(chord.in_half_open_range([4], [1], [3]));
        },

        'key is in reversed range': function () {
            assert.isTrue(chord.in_range([4], [3], [1]));
            assert.isTrue(chord.in_half_open_range([4], [3], [1]));
        },

        'key is not in reversed range': function () {
            assert.isFalse(chord.in_range([2], [3], [1]));
            assert.isFalse(chord.in_half_open_range([2], [3], [1]));
        },

        'key is not in empty range': function () {
            assert.isFalse(chord.in_range([1], [1], [1]));
        },

        'key is in empty range': function () {
            assert.isTrue(chord.in_range([2], [1], [1]));
        },

        'key is in half open empty range': function () {
            assert.isTrue(chord.in_half_open_range([1], [1], [1]));
            assert.isTrue(chord.in_half_open_range([2], [1], [1]));
        },

        'key on lower boundary is not in range': function () {
            assert.isFalse(chord.in_range([1], [1], [3]));
            assert.isFalse(chord.in_half_open_range([1], [1], [3]));
        },

        'key on upper boundary is not in range': function () {
            assert.isFalse(chord.in_range([3], [1], [3]));
        },

        'key on upper boundary is in half open range': function () {
            assert.isTrue(chord.in_half_open_range([3], [1], [3]));
        },

        'specific case that broke for real': function () {
            assert.isFalse(chord.in_range([1456031017,292686529,2153452302,2944297828],
                [1195588147,3697448847,138059749,162608140],
                [1456031017,292686529,2153452302,2944297828]));
        }
    }
}).export(module);