  "use client"
  import React, {useState} from 'react'
  import{ getAuth, setPersistence, browserSessionPersistence, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
  import {auth, db} from "@/lib/firebase";
  import {doc, getDoc} from "firebase/firestore";
  import {useRouter} from "next/navigation";

  



    const EducatorLogin = () => {
    const router = useRouter();
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState("");

    const handleLogin = async () =>{

      setError("");
              try {
                  const userCredential = await signInWithEmailAndPassword(auth, email, password);
                  const uid = userCredential.user.uid;
                  const userDoc = await getDoc(doc(db, "users", uid));
                  if (!userDoc.exists()) {
                      setError("No user found");
                      return;
                  }
                  
                  const roles = userDoc.data().roles;
                  if (roles.includes("teacher") || roles.includes("admin")) {
                      router.push("/teacher");
                  } else {
                      setError("This Account Does Not Have Educator Access");
                  }
              } catch (err) {
                  setError("Invalid Email or Password");
              }


    };






  
    return (
      <main className= "relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/potw2536a1.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
        }}>
        <div className=" flex-col flex items-center bg-lavender rounded-3xl px-12 pb-12">  
              <h1 className="text-black text-[112px] font-black text-center"> 
                Nebula
              </h1> 
              <h2 className="text-black text-[20px] font-black inline-flex justify-center underline -mt-4">
                Admin Portal
              </h2>
        
          <div className=" rounded-2xl">
            <input 
                    id="email"
                    className="w-full bg-lavender-deep px-4 h-12 text-gray-dark mt-12 ring-gray-light ring-2 rounded-full focus:ring-2 focus:outline-none focus:ring-coral" 
                    placeholder="E-mail" 
                    type="email"
                    autoComplete='username'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  
                  />
            <input 
                    id="password"
                    className="w-full bg-lavender-deep px-4 h-12 text-gray-dark ring-gray-light ring-2 rounded-full focus:outline-none focus:ring-coral mt-12" 
                    placeholder="Password" 
                    type="password"
                    autoComplete='current-password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  
                  /> 
              <button onClick={handleLogin} className="w-full rounded-full text-cream text-center text-3xl bg-coral hover:bg-violet py-4 cursor-pointer font-black shadow-2xl mt-24">
                      Log in
                      </button>
            </div>     
          </div> 
      </main>
    )
  }


  export default EducatorLogin

