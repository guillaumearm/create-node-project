import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { addition } from '../../../addition';

type CustomWorld = {
  n1: number;
  n2: number;
  result?: number;
};

Given<CustomWorld>('I have a number {int} and a number {int}', function (n1: number, n2: number) {
  this.n1 = n1;
  this.n2 = n2;
});

When<CustomWorld>('I add then', function () {
  this.result = addition(this.n1, this.n2);
});

Then('result is {int}', function (result: number) {
  assert(this.result === result, 'bad expected result');
});
