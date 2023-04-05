import React from 'react';


export  function Layout() {
  const [count, setCount] = React.useState(0);
  return (
      <div>
       <h1>This is Hcc 11 - cc</h1>
        <div>
          {count}
          <button onClick={() => {
            setCount(count + 1);}
          }>Add count</button>
        </div>
      </div>
  );
}

