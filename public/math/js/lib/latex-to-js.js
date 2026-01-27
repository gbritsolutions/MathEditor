/*
 * Author: Tobi Ayilara
 * Website: http://crownie.tk
 * github: https://github.com/crownie/latex-to-js
 * 
 * Copyright 2014 Tobi Ayilara
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy
 of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations under
 the License.
*/
var latex_to_js = function(input) {
    console.log("in:",input);
    var init, fraction, square_root, nth_root, nth_power, sin, cos, tan, sinCosTanFramework, convert_others;

    init = function(input) {
	var st1 = input;
	st1 = st1.replace(/\s/g, "");
	st1 = st1.replace(/\\times/g, "*");
	st1 = st1.replace(/\\div/g, "/");

	//pi
	st1 = st1.replace(/([0-9a-zA-Z\.]+)\\pi/g, "$1*3.142");
	st1 = st1.replace(/\\pi([0-9a-zA-Z\.]+)/g, "3.142*$1");
	st1 = st1.replace(/([0-9a-zA-Z\.]+)\\pi([0-9a-zA-Z\.]+)/g, "$1*3.142*$2");
	st1 = st1.replace(/\\pi/g, "3.142");

	st1 = fraction(st1);
	//clean up brackets
	st1 = st1.replace(/\\left(\(|\[|\{)/g, "(");
	st1 = st1.replace(/\\right(\)|\]|\})/g, ")");
	st1 = st1.replace(/\{/g, "(");
	st1 = st1.replace(/\}/g, ")");
	st1 = st1.replace(/−/g,"-");
	return st1;
    };

    fraction = function(input) {
	while (input.search(/\\frac\{(((?![\{\}]).)*)\}\{(((?![\{\}]).)*)\}/) >= 0) {
	    
	    input = input.replace(/\\frac\{(((?![\{\}]).)*)\}\{(((?![\{\}]).)*)\}/g, "($1)/($3)");
	}

	return input;
    };

    return init(input);
}
