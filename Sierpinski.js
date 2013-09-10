/*
  Copyright © Iain McDonald 2012
  
  This file is part of Sierpinski Gasket.

	Sierpinski Gasket is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Sierpinski Gasket is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with Sierpinski Gasket.  If not, see <http://www.gnu.org/licenses/>.
*/
var context = document.getElementById('myCanvas').getContext('2d');
var canvas = document.getElementById('myCanvas');
var grey = '#e0e0e0';
var black = '#000000';

function drawRow(rowDepth, previousRow)
{
	var rows = 64;
	var currentRow = [];
	currentRow[0] = {};
	currentRow[0].value = 1;
	currentRow[0].x = previousRow[0].x - 5;
	currentRow[0].y = 10 + (rowDepth / (rows - 1)) * 546;
	currentRow[previousRow.length] = {};
	currentRow[previousRow.length].value = 1;
	currentRow[previousRow.length].x = previousRow[previousRow.length-1].x + 5;
	currentRow[previousRow.length].y = 10 + (rowDepth / (rows - 1)) * 546;
	
	for (var i = 0; i < previousRow.length - 1; ++i)
	{
		currentRow[i+1] = {};
		currentRow[i+1].value = (previousRow[i].value + previousRow[i+1].value) % 10;
		currentRow[i+1].x = currentRow[i].x + 10;
		currentRow[i+1].y = currentRow[i].y;
	}
	
	for (var i = 0; i < currentRow.length; ++i)
	{
		if (currentRow[i].value % 2 == 0)
			context.fillStyle = grey;
		else
			context.fillStyle = black;
		
		context.fillText(currentRow[i].value, currentRow[i].x, currentRow[i].y);
	}
	
	if (rowDepth < (rows - 1))
		setTimeout(function(){ drawRow(rowDepth + 1, currentRow); }, 3000 / rowDepth);
}

function clearCanvas()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	var w = canvas.width;
	canvas.width = 1;
	canvas.width = w;
}

function additionSierpinski()
{
	clearCanvas();
	
	var initialRow = [];
	initialRow[0] = {};
	initialRow[0].x = canvas.width / 2;
	initialRow[0].y = 10;
	initialRow[0].value = 1;

	context.fillText(initialRow[0].value, initialRow[0].x, initialRow[0].y);
	
	setTimeout(function(){ drawRow(1, initialRow); }, 3000);
}

var points = [];

function colourPoint(point)
{
	context.beginPath();
	context.arc(point.x, point.y, 1, 0, 2 * Math.PI);
	context.closePath();
	context.stroke();
}

function randomPoint(pointNumber, previousPoint)
{
	var currentPoint = {};
	var randomVertex = points[Math.round((Math.random() * 3)) % 3];
	
	currentPoint.x = previousPoint.x + (randomVertex.x - previousPoint.x) / 2; 
	currentPoint.y = previousPoint.y + (randomVertex.y - previousPoint.y) / 2; 

	colourPoint(currentPoint);

	if (pointNumber < 7500)
		setTimeout(function(){ randomPoint(pointNumber + 1, currentPoint); }, 1000 / pointNumber);
}

function randomSierpinski()
{
	clearCanvas();

	points[0] = {};
	points[0].x = canvas.width / 2.0 + 3;
	points[0].y = 7.0;
	colourPoint(points[0]);

	points[1] = {};
	points[1].x = 13.0;
	points[1].y = canvas.height - 13.0;
	colourPoint(points[1]);

	points[2] = {};
	points[2].x = canvas.width - 7.0;
	points[2].y = canvas.height - 13.0;
	colourPoint(points[2]);

	var startingPoint = {};
	startingPoint.x = points[0].x;
	startingPoint.y = points[0].y;
	colourPoint(startingPoint);
	
	setTimeout(function(){ randomPoint(1, startingPoint); }, 1000);
}

var lineCount = 0;
function recursiveFractal(line, i, turnClockwise)
{
	var rotateBy = Math.PI / 3;
	if (turnClockwise)
		rotateBy = -rotateBy;

	if (i > 0)
	{
		scale(line, 0.5);
		rotate(line, rotateBy);
		recursiveFractal(line, i - 1, !turnClockwise);
		rotateBy = -rotateBy;
		rotate(line, rotateBy);
		recursiveFractal(line, i - 1, turnClockwise);
		rotate(line, rotateBy);
		recursiveFractal(line, i - 1, !turnClockwise);
		rotateBy = -rotateBy;
		rotate(line, rotateBy);
		scale(line, 2.0);
		return;
	}

	var xStart = line.xStart;
	var yStart = line.yStart;
	var xEnd = line.xEnd;
	var yEnd = line.yEnd;
	drawLine(xStart, yStart, xEnd, yEnd);
	translate(line, line.xEnd - line.xStart, line.yEnd - line.yStart);
}

function drawLine(xStart, yStart, xEnd, yEnd)
{
	context.beginPath();
	context.moveTo(xStart, yStart);
	context.lineTo(xEnd, yEnd);
	context.closePath();
	context.stroke();
}

function translate(line, x, y)
{
	var translate = new Array(3);
	translate[0] = new Array(1.0, 0.0, 0.0);
	translate[1] = new Array(0.0, 1.0, 0.0);
	translate[2] = new Array(x,   y,   1.0);

	applyMatrixToLine(line, translate);
}

function scale(line, factor)
{
	var scale = new Array(3);
	scale[0] = new Array(factor, 0.0,    0.0);
	scale[1] = new Array(0.0,    factor, 0.0);
	scale[2] = new Array(0.0,    0.0,    1.0);

	var xInitial = line.xStart;
	var yInitial = line.yStart;
	
	translate(line, -xInitial, -yInitial);
	applyMatrixToLine(line, scale);
	translate(line, xInitial, yInitial);
}

function rotate(line, radians)
{
	var rotate = new Array(3);
	rotate[0] = new Array(Math.cos(radians), -Math.sin(radians), 0.0);
	rotate[1] = new Array(Math.sin(radians),  Math.cos(radians), 0.0);
	rotate[2] = new Array(0.0,                0.0,               1.0);

	var xInitial = line.xStart;
	var yInitial = line.yStart;
	
	translate(line, -xInitial, -yInitial);
	applyMatrixToLine(line, rotate);
	translate(line, xInitial, yInitial);
}

function applyMatrixToLine(line, matrix)
{
	var lineStartVector = new Array(line.xStart, line.yStart, 1.0);	
	var outputVector = matrixMultiply(lineStartVector, matrix);
	line.xStart = outputVector[0];
	line.yStart = outputVector[1];

	var lineEndVector = new Array(line.xEnd, line.yEnd, 1.0);
	outputVector = matrixMultiply(lineEndVector, matrix);
	line.xEnd = outputVector[0];
	line.yEnd = outputVector[1];
}

function matrixMultiply(vector, matrix)
{
	var outputVector = new Array(0.0, 0.0, 0.0);
	for (var i = 0; i < matrix.length; ++i)
	{
		var result = 0.0;
		for (var j = 0; j < matrix[0].length; j++)
			result += matrix[j][i] * vector[j];
		outputVector[i] = result;
	}

	return outputVector;
}

function fractalSierpinski()
{
	for (var i = 0; i < 11; ++i)
	{
		drawTriangle(i);
	}
}

function drawTriangle(i)
{
	lineCount = 0;
	var line = {};
	line.xStart = 13.0;
	line.yStart = canvas.height - 13.0;
	line.xEnd = canvas.width - 7.0;
	line.yEnd =  canvas.height - 13.0;
	setTimeout(function(){ clearCanvas(); recursiveFractal(line, i, false); }, 5000 * Math.pow(i, 0.6) );
}
