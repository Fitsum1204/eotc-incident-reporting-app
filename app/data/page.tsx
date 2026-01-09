//'use client';
//import { useEffect, useState } from 'react'; // Added space for style
const D = [
 { "id":1,
  "name":"fitsu"},
  { "id":2,
    "name":"fits"},
  { "id":3,
      "name":"fit"},
   { "id":4,
        "name":"fitsum"},
  

]

const Data = async() => {
  /* const [users, setUsers] = useState<{ id: number; name: string }[]>([]); // Renamed for clarity, added type
  useEffect(()=>{
    const userData = async () => {
      try {
         const res= await fetch('https://jsonplaceholder.typicode.com/users')
         if (!res.ok) throw new Error('Fetch failed');
         const data = res.json()
         setUsers()
      } catch (error) {
        console.error('Error fetching users:', error);
     
    } }
    userData()
  },[]) */
  const res= await fetch('https://jsonplaceholder.typicode.com/users')
  if (!res.ok) throw new Error('Fetch failed');
  const users= res.json()
  
  const usersData = await users;
  return (
    <div>
      {usersData.map((u: { id: number; name: string }) => (
        <div key={u.id}>
          <h1>{u.name}</h1>
        </div>
      ))}
    </div>
  );
};

export default Data;
