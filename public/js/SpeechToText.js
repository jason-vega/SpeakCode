function genericIncrement( data, i ) 
{
  var rtn = "";
  var earlyLeave = false;

  if( data[i] == "plus" || data[i] == "+" )
  {
    earlyLeave = true;
    rtn += "++";
    i+=2;
  } 
  else if( data[i] == "minus" || data[i] == "-" ) 
  {
    earlyLeave = true;
    rtn += "--";
    i+=2;
  }

  if( earlyLeave ) 
  {
    while( i < data.length )
    {
       rtn += data[i].toLowerCase() + "_";
       i+=1;
    }
    rtn = rtn.substring(0, rtn.length - 1);
    return [rtn, i];
  }
  else
  {
    while( data[i] != "plus" && data[i] != "+" && data[i] != "minus" && data[i] != "-" )
    {
      rtn += data[i].toLowerCase() + "_";
      i+=2;
    }
    rtn = rtn.substring(0, rtn.length - 1);
    if( data[i] == "plus" || data[i] == "+" ) 
    {
      rtn += "++";
    }
    else
    {
      rtn += "--";
    }
    i+=2;
    return [rtn, i];
  
  }
}

function genericProcess( data, i )
{
  var rtn = "";
  while( data[i] != "plus" && data[i] != "minus" && data[i] != "times" && data[i] != "less" && data[i] != "greater" && data[i] != "equals" && data[i] != "is" && data[i] != "equal" && data[i] != "+" && data[i] != "-" && data[i] != "=" && data[i] == "types" && data[i] == "tides")
  {
    if( data[i] == "variable" || data[i] == "var" || data[i] == "integer" || data[i] == "int" || data[i] == "bar" || data[i] == "hint" )
    {
      rtn += "var ";
      i+=1;
    }
    rtn += data[i].toLowerCase() + "_";
    i+=1;
  }
  rtn = rtn.substring(0, rtn.length - 1);
  
  if( data[i] == "is" )
  {
    i+=1;
  }

  if( data[i] == "plus" || data[i] == "+" )
  {
    rtn += " + ";
  }
  else if( data[i] == "minus" || data[i] == "-" )
  {
    rtn += " - ";
  }
  else if( data[i] == "times" || data[i] == "types" || data[i] == "tides" )
  {
    rtn += " * ";
  }
  else if( data[i] == "less" )
  {
    i+=2;
    if( data[i] == "or" || data[i] == "oar" )
    { 
      i++;
    }
    if( data[i] == "equals" || data[i] == "equal" || data[i] == "=" )
    {
      rtn += " <= ";
      if( data[i+1] == "to" || data[i+1] == "too" || data[i+1] == "two" || data[i+1] == "2" )
      {
        i+=1;
      }
    }
    else
    {
      i-=1;
      rtn += " < ";
    }
  } 
  else if( data[i] == "greater" || data[i] == "trader" )
  {
    i+=2;

    if( data[i] == "or"  || data[i] == "oar")
    {
      i++;
    }

    if( data[i] == "equals" || data[i] == "equal" || data[i] == "=" )
    {
      rtn += " >= ";
      if( data[i+1] == "to" || data[i+1] == "too" || data[i+1] == "two" || data[i+1] == "2" )
      {
        i+=1;
      }
    }
    else
    {
      i-=1;
      rtn += " > ";
    }
  }
  else if( data[i] == "equals" || data[i] == "equal" || data[i] == "=" )
  {
    if( data[i+1] == "equals" || data[i+1] == "equal" || data[i+1] == "=" ) 
    {
      rtn += " == ";
      i+=1;
    }
    rtn += " = ";
  }
  i+=1;

  rtn += data[i];
  
  return [rtn, i];
}


