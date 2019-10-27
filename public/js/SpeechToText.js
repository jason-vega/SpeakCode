function genericIncrement( data, i ) 
{
  var rtn = "";
  var earlyLeave = false;

  if( data[i] == "plus" )
  {
    earlyLeave = true;
    rtn += "++";
    i+=2;
  } 
  else if( data[i] == "minus" ) 
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
    while( data[i] != "plus" && data[i] != "minus" )
    {
      rtn += data[i].toLowerCase() + "_";
      i+=2;
    }
    rtn = rtn.substring(0, rtn.length - 1);
    if( data[i] == "plus" ) 
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
  while( data[i] != "plus" && data[i] != "minus" && data[i] != "times" && data[i] != "less" && data[i] != "greater" && data[i] != "equals" && data[i] != "is" && data[i] != "equal")
  {
    if( data[i] == "variable" || data[i] == "var" || data[i] == "integer" || data[i] == "int" )
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

  if( data[i] == "plus" )
  {
    rtn += " + ";
  }
  else if( data[i] == "minus" )
  {
    rtn += " - ";
  }
  else if( data[i] == "times" )
  {
    rtn += " * ";
  }
  else if( data[i] == "less" )
  {
    i+=2;
    if( data[i] == "or" )
    { 
      i++;
    }
    if( data[i] == "equals" || data[i] == "equal" )
    {
      rtn += " <= ";
      if( data[i+1] == "to" || data[i+1] == "too" )
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
  else if( data[i] == "greater" )
  {
    i+=2;

    if( data[i] == "or" )
    {
      i++;
    }

    if( data[i] == "equals" || data[i] == "equal" )
    {
      rtn += " >= ";
      if( data[i+1] == "to" || data[i+1] == "too" )
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
  else if( data[i] == "equals" || data[i] == "equal" )
  {
    if( data[i+1] == "equals" || data[i] == "equal" ) 
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


