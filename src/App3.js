import React, { useEffect, useState } from 'react';
import './RandomUsers.css';


export default function RandomUsers(){
    const [users, setUsers]=useState([]);
    const [error, setError]=useState('');
    const [loading, setLoading]=useState(false);
    const [resultsCount, setResultsCount]=useState(5);
    const [selectedUser, setSelectedUser]=useState(null);

    useEffect(()=>{
        const fetchData=async()=>{
            setLoading(true);
            setError('');

            try{
            const res=await fetch(`https://randomuser.me/api/?results=${resultsCount}&nat=us,gb,ca,au`);
            if(!res.ok) throw new Error(`HTTP ${res.status}`);

            const data= await res.json();
            setUsers(data.results|| []);
        }catch(err){
            console.log(err);
            setError("Failed to fetch users. Please check your connection");
            setUsers([]);
        }finally{
            setLoading(false);
        }
        };
        fetchData();
    },[]);

    return(
        <div>
            <Title/>
            <Body users={users} loading={loading} error={error}/>
        </div>
    )

 
}

   function Title(){
        return(
        <div className="title-section">
            <h1>Random Users Generator</h1>
        </div>
        )
    }

    function Body({users,loading, error}){
        return(
            <div className="images-body">
                <div className="images-title">
                    <h1>Ramdom Users</h1>
                    {loading&&<p>Loading...</p>}
                    {error && <p style={{color:'red'}}>{error}</p>}
                    <div className="users-list">
                        {users.length===0&&!loading&&<p>No Users found</p>}

                        {users.map((user, index)=>(
                            <div key={index} className="user-card">
                                <img src={user.picture.medium} alt={user.name.first}/>
                                <p>{user.name.first} {user.name.last}</p>
                                <p>{user.location.city} {user.location.country}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="images-body"></div>
            </div>
        )
    }