function main( contents ) {
// Translate speech to code
var finalOutput = "";
var lineNum = -1;
var tabNum = 0;
contents = contents.toLowerCase();
var data = contents.replace(/[.,\/#!$%\^&\*;:{}\_`~()]/g,"").split(/[.,!?;!@#$%^&*()<>:"'`~ ]+/);
var i = 0;

//alert(data);

// Variables
if( data[i] == "variable" || data[i] == "var" || data[i] == "int" || data[i] == "integer" || data[i] == "string" )
{
  finalOutput += "var ";
  i++;

  while( data[i] != "equals" && data[i] != "equal" && data[i] != "=" )
  {
    finalOutput += data[i].toLowerCase() + "_";
    i++;
  }

  finalOutput = finalOutput.substring(0 , finalOutput.length - 1 );
  finalOutput += " = ";
  i++;

  if( !isNaN(data[i]) )
  {
    while( i < data.length )
    {
      finalOutput += data[i];
      i++;
    
  
      if( i >= data.length ) 
      {
        break;
      }
  
      if( data[i] == "plus" || data[i] == "+" )
      {
        finalOutput+= " + ";
      }
      else if( data[i] == "minus" || data[i] == "-" ) 
      {
        finalOutput += " - ";
      }
      else if( data[i] == "times" )
      {
        finalOutput += " * ";
      } 
      i++;
      finalOutput += data[i];
    }
  }
  else
  {
    while( i < data.length ) 
    {
      finalOutput += "\"" + data[i].toLowerCase() + "\" ";
      i++;
    }
    finalOutput = finalOutput.substring( 0, finalOutput.length - 1);
  }
  finalOutput += ";";
  lineNum = 2;
}
//For loop
else if( data[i] == "for" || data[i] == "four" || data[i] == "4" || data[i] == "or" )
{
  finalOutput += "for( ";
  i++;

  var gen = genericProcess( data, i );

  finalOutput += gen[0] + "; ";
  i = gen[1];
  i++;

  gen = genericProcess( data, i );
  finalOutput += gen[0] + "; ";
  i = gen[1];
  i++;

  gen = genericIncrement( data, i );
  finalOutput += gen[0] + " ) { \n}";
  i++;

  lineNum = 2;
  tabNum = 1;
}
//If statement
else if( data[i] == "if" || data[i] == "bif" )
{
  finalOutput += "if( ";
  i++;

  var gen = genericProcess( data, i );
  finalOutput += gen[0] + " ) {\n}";
  i = gen[1];
  i++;

  lineNum = 2;
  tabNum = 1;
}
//While Loop
else if( data[i] == "while" )
{
  finalOutput += "while( ";
  i++;

  var gen = genericProcess( data, i );
  finalOutput += gen[0] + " ) {\n}";
  i = gen[1];
  i++; 

  lineNum = 2;
  tabNum = 1;
}
// Console.log  /  print
else if( data[i] == "console" || data[i] == "print" )
{
  if( data[i] == "console" )
  {
    if( data[i+1] == "dot" )
    {
      i+=2;
    }
    if( data[i] == "log" )
    {
      i++;
      finalOutput += "console.log( ";
    }
  }
  else
  {
    finalOutput += "console.log( ";
    i++;
  }
  
  while( i < data.length ) 
  {
    finalOutput += data[i].toLowerCase() + "_";
    i+=1;
  }
  finalOutput = finalOutput.substring( 0, finalOutput.length - 1) + " ); ";
  lineNum = 2;
}
// Post/Pre Increment/Decrement
else if( data[i+1] == "plus" || data[i+1] == "minus" )
{
  if( data[i] == "plus" || data[i] == "+" || data[i] == "minus" || data[i] == "-" )
  {

    if( data[i] == "plus" || data[i] == "+" )
    {
      finalOutput += "++";
      i+=2;
    }
    else if( data[i] == "minus" || data[i] == "-" )
    {
      finalOutput += "--";
      i+=2;
    }

    while( i < data.length )
    {
      finalOutput += data[i++].toLowerCase() + "_";
    }
    finalOutput = finalOutput.substring(0, finalOutput.length - 1) + ";";
  }
  else
  {
    while( data[i] != "plus" && data[i] != "+" && data[i] != "minus" && data[i] != "-" )
    {
      finalOutput += data[i++].toLowerCase() + "_";
    }
    finalOutput = finalOutput.substring(0, finalOutput.length - 1);

    if( data[i] == "plus" || data[i] == "+" )
    {
      finalOutput += "++;";
    }
    else
    {
      finalOutput += "--;";
    }
  }
}
// normal variable assignment
else if( data[i] == "equals" || data[i] == "equal" || data[i+1] == "equals" || data[i+1] == "equal" || data[i+2] == "equals" || data[i+2] == "equal" )
{
  while( data[i] != "equals" && data[i] != "equal" )
  {
    finalOutput += data[i++].toLowerCase() + "_";
  }
  finalOutput = finalOutput.substring(0, finalOutput.length - 1) + " = ";
  i+=1;

  while( i < data.length )
  {
    if( data[i] == "plus" || data[i] == "+" )
    {
      finalOutput += "+ ";
    }
    else if( data[i] == "minus" || data[i] == "-" )
    {
      finalOutput += "- ";
    }
    else if( data[i] == "times" )
    {
      finalOutput += "* ";
    }
    else if( data[i] == "equals" || data[i] == "equal" || data[i] == "=")
    {
      finalOutput += "= ";
    }
    else if( !isNaN(data[i]) )
    {
      finalOutput += data[i] + " ";
    }
    else 
    {
      while( data[i] != "plus" && data[i] != "+" && data[i] != "minus" && data[i] != "-" && data[i] != "times" )
      {
        if( data[i].substring(0, 1) == "+" || data[i].substring(0,1) == "-" )
        {
          finalOutput = finalOutput.substring(0, finalOutput.length - 1 ) + " ";
          finalOutput = finalOutput + data[i].substring(0,1) + " " + data[i].substring(1,2) + " ";
          i+=2;
          break;
        }
        finalOutput += data[i] + "_";
        i++;
        if( i >= data.length )
        {
          break;
        }
      }
      i--;
      finalOutput = finalOutput.substring(0, finalOutput.length - 1) + " ";
    }
    i++;
  }
  finalOutput = finalOutput.substring(0, finalOutput.length - 1) + ";";
  lineNum = 2;
}
else 
{
    // ERROR IN HERE
    lineNum = -1;
}

//alert( contents );
//alert( finalOutput );

lineNum--;
var output = finalOutput.split("\n");
return [output, lineNum, tabNum];
}
