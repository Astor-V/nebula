"use client"
import React, { useState, useEffect } from "react"
import { classDoc } from "@/lib/ClassFiles/classes";
import {FileChooser } from "@/lib/FileProcessing/fileChooser";
import { School, GraduationCap, BookOpen, ScrollText, Users, Settings, ChevronDown, XCircle } from "lucide-react";
import { moduleDoc, subscribeToClassModules, updateModule, addModule, deleteModule} from "@/lib/ClassFiles/module";



type ClassNavTab = "home" | "grades" | "modules" | "syllabus" | "roster" ;

type ClassPageProps = {
  classData: classDoc;
};

export const ClassPage = ({ classData }: ClassPageProps) => {
  const [classNavTab, setClassNavTab] = useState<ClassNavTab>("home");
  const [editMode, setEditMode] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModuleClosed, setIsModuleClosed] = useState<Set<string>>(new Set ())
  const [modules, setModules] = useState<moduleDoc[]>([]);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const navItems: { id: ClassNavTab; label: string; icon: React.ElementType }[] = [
    { id: "home", label: "Home", icon: School },
    { id: "syllabus", label: "Syllabus", icon: ScrollText },
    { id: "modules", label: "Modules", icon: BookOpen },
    { id: "grades", label: "Grades", icon: GraduationCap },
    { id: "roster", label: "Roster", icon: Users },
    
  ];

  const toggleModule = (id : string) => {
    setIsModuleClosed((prev) => {
      const next = new Set(prev);

        if (isModuleClosed.has(id)){
          next.delete(id)
        } else {next.add(id)}
        return next;
    });
  };

  useEffect(() => {
  const unsub = subscribeToClassModules(classData.id, (loaded) => {
    setModules(loaded);
  });
  return unsub;
}, [classData.id]);

  const renderContent = () => {
    if (classNavTab === "home") { return ( 
      <div className="flex flex-col items-center gap-8 p-2">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Announcements</h2>
             <p className="text-gray text-center">No announcements yet.</p>
          </div>
        <h1 className="text-center text-bold text-6xl underline">
          {classData.name}
        </h1>
      </div>
    );
  }

    if (classNavTab === "syllabus") return <div className="flex flex-col justify-center items-center underline text-bold text-4xl gap-16">
      <FileChooser classId={classData.id} onUploaded={(file) => console.log("uploaded:", file)} />
    </div>;
  


  if (classNavTab === "modules") {
  const handleAddModule = async () => {
    const newModule = await addModule(classData.id);
    setEditingModuleId(newModule.id);
  };

  if (modules.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        {editMode && (
          <button onClick={handleAddModule} className="bg-steel-blue text-white px-6 py-2 rounded-full cursor-pointer">
            + Add Module
          </button>
        )}
        <div className="flex flex-col justify-center items-center gap-2 border-2 border-dashed rounded-xl p-10 max-w-md mx-auto">
          <p className="text-3xl font-semibold text-foreground">No Modules Found</p>
          <p className="text-4xl font-bold text-center">Click the gear button to add a Module!</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      {modules.map((m) => (
        <div key={m.id} className={`flex items-center gap-3 bg-cream border  px-3 py-3 mb-3 text-2xl ${!isModuleClosed.has(m.id) ? "border-transparent border-b-violet rounded-none" : "border border-violet rounded-2xl" }`}>
          <button onClick={() => toggleModule(m.id)}><ChevronDown className={`w-4 h-4 ${!isModuleClosed.has(m.id) ? "-rotate-0" : "-rotate-90" }`}/></button>
          {editingModuleId === m.id ? (
             <input
              defaultValue={m.name}
              autoFocus
              onKeyDown={(e) =>{ 
                if(e.key === "Enter"){
                  e.currentTarget.blur()
                }
              }}
              onBlur = {async (e) => {
                if(e.target.value.trim() === '' || e.target.value === m.name){
                  setEditingModuleId(null)
                  return
                }
                await updateModule(m.id, e.target.value);
                setEditingModuleId(null);
              }}
            />
          ) : (
          <button onDoubleClick={() => editMode && setEditingModuleId(m.id)} onClick={() => toggleModule(m.id)}>{m.name || "Untitled Unit"}</button>
           )}
           {editMode && (
           <button onClick={() => { if (window.confirm("Delete this module?")) deleteModule(m.id); }} className="ml-auto hover:text-cherry cursor-pointer"><XCircle/></button>
          )}
        </div>
))}
    </div>
  );
}



    if (classNavTab === "grades") return <div>Grades content</div>;







    






    




    if (classNavTab === "roster") return <div>Roster content</div>;



    if (classNavTab === "discussion") return <div>Discussion content</div>;

    return null;
  };




  
  return (
  <div className="flex h-full">
    <button
    onClick={() => {setEditMode(!editMode); console.log(!editMode); setIsSpinning(true)}}
    onAnimationEnd={() => setIsSpinning(false)}
    className={`fixed bottom-6 right-6 p-4 rounded-full active:scale-95 cursor-pointer hover:scale-105 ${editMode ? "bg-violet-500 shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30" : "bg-steel-blue shadow-md shadow-steel-blue/20 hover:shadow-lg hover:shadow-steel-blue/30"} ${isSpinning ? "animate-spin-once" : ""} text-white`}
    >
  <Settings className="w-5 h-5" />
    </button>
      <div className="w-56 flex flex-col gap-1 border-r border-gray py-6 px-3">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setClassNavTab(id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              classNavTab === id ? "bg-steel-blue text-white" : "hover:bg-white/40"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  );
};