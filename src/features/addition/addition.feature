Feature: Addition
  As a developer, I want to check if cucumber-js work

  Scenario: add 2 positive numbers
    Given I have a number 20 and a number 22
    When I add then
    Then result is 42

  Scenario: add 2 negative numbers
    Given I have a number -20 and a number -22
    When I add then
    Then result is -42
