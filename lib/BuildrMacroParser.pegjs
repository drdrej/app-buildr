start
  = (txt* "/*#" commandBlock "#*/" )* txt*

txt
  = .+

commandBlock
  =  cmd:command " "+ what + " "+ with " "+ end { return cmd; }

command
  = [a-z]+

what
  = [a-z]+

with
  = [a-z]+
  
end
  = "."
