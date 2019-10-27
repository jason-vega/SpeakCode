function main( contents ) {
// Translate speech to code
var finalOutput = "";
var lineNum = -1;
var data = contents.split(/[.,!?;!@#$%^&*()<>:"'`~ ]/);
var i = 0;

alert(data);

// Variables
if( data[i] == "variable" || data[i] == "var" || data[i] == "int" || data[i] == "integer" || data[i] == "string" )
{
  finalOutput += "var ";
  i++;

  while( data[i] != "equals" )
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
  
      if( data[i] == "plus" )
      {
        finalOutput+= " + ";
      }
      else if( data[i] == "minus" ) 
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
      finalOutput += data[i].toLowerCase() + " ";
      i++;
    }
    finalOutput = finalOutput.substring( 0, finalOutput.length - 1);
  }
  finalOutput += ";";
  lineNum = 2;
}
//For loop
else if( data[i] == "for" )
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
  finalOutput += gen[0] + " ) \n{ \n\n}";
  i++;

  lineNum = 3;
}
//If statement
else if( data[i] == "if" )
{
  finalOutput += "if( ";
  i++;

  var gen = genericProcess( data, i );
  finalOutput += gen[0] + " )\n{\n\n}";
  i = gen[1];
  i++;

  lineNum = 3;
}
//While Loop
else if( data[i] == "while" )
{
  finalOutput += "while( ";
  i++;

  var gen = genericProcess( data, i );
  finalOutput += gen[0] + " )\n{\n\n}";
  i = gen[1];
  i++; 

  lineNum = 3;
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
else 
{
  finalOutput += data[i] + " ";
  i++;

  if( data[i] == "plus" )
  {
    finalOutput = finalOutput.substring(0, finalOutput.length - 1) + "++ ";
    i+=2;
  }
  else if( data[i] == "minus" )
  {
    finalOutput = finalOutput.substring(0, finalOutput.length - 1) + "-- ";
    i+=2;
  }

  if( i >= data.length )
  {
    finalOutput = finalOutput.substring(0, finalOutput.length - 1) + ";";
  }
  else
  {
    while( i < data.length )
    {
      if( data[i] == "plus" )
      {
        finalOutput += "+ ";
      }
      else if( data[i] == "minus" )
      {
        finalOutput += "- ";
      }
      else if( data[i] == "times" )
      {
        finalOutput += "* ";
      }
      else if( data[i] == "equals" || data[i] == "equal" )
      {
        finalOutput += "= ";
      }
      else if( !isNaN(data[i]) )
      {
        finalOutput += data[i] + " ";
      }
      else 
      {
        while( data[i] != "plus" && data[i] != "minus" && data[i] != "times" )
        {
          finalOutput += data[i] + "_";
          i++;
          if( i >= data.length )
          {
            break;
          }
        }
        finalOutput = finalOutput.substring(0, finalOutput.length - 1);
      }
      i++;
    }
  }
  finalOutput += ";";
}

//alert( contents );
//alert( finalOutput );

lineNum--;
var output = finalOutput.split("\n");
return [output, lineNum];
}
