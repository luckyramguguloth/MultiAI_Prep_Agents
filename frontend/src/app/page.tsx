"use client";

import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import Agent3DNode from "@/components/Agent3DNode";
import { Play, ShieldCheck, Activity, Terminal, Upload, FileText, CheckCircle2, Copy, ExternalLink, RefreshCw } from "lucide-react";
import * as THREE from "three";

interface AgentState {
  id: string;
  name: string;
  status: "IDLE" | "WORKING" | "ERROR";
  message: string;
  position: [number, number, number];
}

interface TechnicalAnswer {
  q: string;
  a: string;
}

interface PrepLink {
  title: string;
  url: string;
}

interface PipelineResults {
  event: string;
  atsMatchScore: number;
  jobTitle: string;
  coverLetter: string;
  technicalAnswers: TechnicalAnswer[];
  prepLinks: PrepLink[];
}

const INITIAL_AGENTS: AgentState[] = [
  { id: "agent_1_scout", name: "The Scout", status: "IDLE", message: "", position: [-4, 0, -2] },
  { id: "agent_2_tailor", name: "The Tailor", status: "IDLE", message: "", position: [0, 0, -3] },
  { id: "agent_3_submitter", name: "The Submitter", status: "IDLE", message: "", position: [4, 0, -2] },
  { id: "agent_3_1_solver", name: "The Problem Solver", status: "IDLE", message: "", position: [-4, 0, 2] },
  { id: "agent_4_coach", name: "The Prep Coach", status: "IDLE", message: "", position: [0, 0, 3] },
  { id: "agent_5_archivist", name: "The Archivist", status: "IDLE", message: "", position: [4, 0, 2] },
  { id: "agent_6_recycler", name: "The Recycler", status: "IDLE", message: "", position: [-6, 0, 0] },
  { id: "agent_7_orchestrator", name: "The Orchestrator", status: "IDLE", message: "", position: [6, 0, 0] },
];

export default function Dashboard() {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [isTriggering, setIsTriggering] = useState(false);

  // New States for User Uploads & Queries
  const [jobDescription, setJobDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pipelineResults, setPipelineResults] = useState<PipelineResults | null>(null);

  const [showResults, setShowResults] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/agents");

    ws.onopen = () => setWsStatus("connected");
    ws.onclose = () => setWsStatus("disconnected");
    ws.onerror = () => setWsStatus("disconnected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Capture Pipeline Complete Event with results
      if (data.event === "PIPELINE_COMPLETE") {
        setPipelineResults(data);
        setShowResults(true);
      } else if (data.agent_id && data.status) {
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === data.agent_id
              ? { ...agent, status: data.status, message: data.message }
              : agent
          )
        );
      }
    };

    return () => ws.close();
  }, []);

  const triggerPipeline = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a target job description or search query!");
      return;
    }
    
    setIsTriggering(true);
    setPipelineResults(null);
    setShowResults(false);
    
    // Reset all agents to IDLE and clear previous messages
    setAgents(INITIAL_AGENTS.map(agent => ({ ...agent, status: "IDLE", message: "" })));

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      if (uploadedFile) {
        formData.append("resume", uploadedFile);
      }

      await fetch("http://localhost:8000/api/trigger-pipeline", {
        method: "POST",
        body: formData,
      });
    } catch (e) {
      console.error("Failed to trigger pipeline");
    }
    setTimeout(() => setIsTriggering(false), 1000);
  };

  const copyToClipboard = () => {
    if (pipelineResults?.coverLetter) {
      navigator.clipboard.writeText(pipelineResults.coverLetter);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-slate-200 relative overflow-hidden flex flex-col font-sans">
      
      {/* 1. Header HUD Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-1 pointer-events-auto">
            Multi AI Job Prep Agents
          </h1>
          <div className="flex gap-3 text-xs font-mono text-slate-400 pointer-events-auto">
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
              <Activity size={12} className={wsStatus === "connected" ? "text-emerald-500" : "text-red-500"} />
              WSS: {wsStatus}
            </span>
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 shadow-lg">
              <ShieldCheck size={12} />
              AES-256 Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Interface Split */}
      <div className="flex-1 w-full h-full flex relative">
        
        {/* LEFT COMPONENT: Floating Glass Config Panel */}
        <div className="absolute top-24 left-6 w-96 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl z-20 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
          <div>
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Terminal size={18} className="text-emerald-400" />
              AI Agent Controller
            </h2>
            <p className="text-xs text-slate-400">Configure parameters and upload resume to execute multi-agent task flows.</p>
          </div>

          <hr className="border-white/5" />

          {/* Chatbox / Query Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">Target Job Specification / Query</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. Senior Fullstack Engineer proficient in React 19, FastAPI, WebSockets and high-performance WebGL shadows..."
              className="w-full h-28 bg-slate-950 border border-white/10 hover:border-white/20 focus:border-emerald-500/50 rounded-xl p-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 resize-none font-mono"
            />
          </div>

          {/* Resume Upload Dropzone */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">Resume Document</label>
            <div className="relative group">
              <input
                type="file"
                accept=".pdf,.docx,.txt,.json"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${uploadedFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-slate-950 group-hover:border-white/20'}`}>
                {uploadedFile ? (
                  <>
                    <CheckCircle2 size={24} className="text-emerald-400" />
                    <span className="text-xs font-mono text-emerald-300 font-bold max-w-[200px] truncate">{uploadedFile.name}</span>
                    <span className="text-[10px] text-emerald-500">File attached successfully</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-xs font-medium text-slate-300">Drag or Click to upload Resume</span>
                    <span className="text-[10px] text-slate-500 font-mono">Accepts PDF, DOCX, TXT, JSON</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Submit Trigger Button */}
          <button
            onClick={triggerPipeline}
            disabled={isTriggering || wsStatus !== "connected" || !jobDescription.trim()}
            className="w-full relative px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-900 text-white font-bold rounded-xl shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none overflow-hidden border border-emerald-400/30 flex items-center justify-center gap-2"
          >
            {isTriggering ? (
              <>
                <RefreshCw size={16} className="animate-spin text-white" />
                <span className="uppercase tracking-widest text-xs">Deploying CrewAI...</span>
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span className="uppercase tracking-widest text-xs">Deploy AI Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COMPONENT: Slid-in Dynamic Results Dossier */}
        {showResults && pipelineResults && (
          <div className="absolute top-24 right-6 w-[420px] bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl z-20 flex flex-col gap-5 max-h-[80vh] overflow-y-auto animate-fade-in-left">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText size={18} className="text-emerald-400" />
                  Interview Prep Dossier
                </h2>
                <p className="text-xs text-slate-400">Agent optimizations completed successfully.</p>
              </div>
              <button 
                onClick={() => setShowResults(false)}
                className="text-xs text-slate-500 hover:text-slate-300 font-mono bg-white/5 px-2.5 py-1 rounded-md border border-white/5 transition-all"
              >
                Close
              </button>
            </div>

            <hr className="border-white/5" />

            {/* ATS Score Circular Radial Visualizer */}
            <div className="flex items-center gap-4 bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-slate-800" strokeWidth="4" fill="transparent" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-emerald-500" strokeWidth="4" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * (1 - 0.97)} 
                  />
                </svg>
                <span className="absolute text-sm font-black text-emerald-400 font-mono">97%</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-300">ATS Optimization Score</h3>
                <p className="text-xs text-slate-400 leading-normal">The Tailor optimized your keywords to outscore standard filters for the target role.</p>
              </div>
            </div>

            {/* Tailored Cover Letter Panel */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">Cover Letter Payload</span>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Copy size={10} />
                  {isCopied ? "Copied!" : "Copy Letter"}
                </button>
              </div>
              <div className="bg-slate-950 border border-white/5 rounded-xl p-3 h-32 overflow-y-auto text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                {pipelineResults.coverLetter}
              </div>
            </div>

            {/* Solved Assessment Q&A Panel */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">Solved Technical Assessment</span>
              <div className="space-y-3">
                {pipelineResults.technicalAnswers?.map((item: TechnicalAnswer, idx: number) => (
                  <div key={idx} className="bg-slate-950/60 border border-white/5 rounded-xl p-3 flex flex-col gap-1.5">
                    <p className="text-xs font-bold text-white font-mono flex gap-1"><span className="text-emerald-400">Q:</span> {item.q}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono pl-3 border-l border-emerald-500/20"><span className="text-blue-400 font-bold">A:</span> {item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Prep Resource Links */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">Dynamic Preparation Links</span>
              <div className="grid grid-cols-1 gap-2">
                {pipelineResults.prepLinks?.map((link: PrepLink, idx: number) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-between items-center bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-emerald-500/30 rounded-xl p-3 text-xs transition-all group"
                  >
                    <span className="text-slate-300 group-hover:text-white transition-colors truncate max-w-[280px]">{link.title}</span>
                    <ExternalLink size={12} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 3D WebGL Engine Layer */}
        <div className="flex-1 w-full h-full relative cursor-move">
          {/* Suppressed shadow deprecation by explicitly mapping PCFShadowMap type */}
          <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 8, 12], fov: 45 }}>
            <color attach="background" args={["#050505"]} />
            <fog attach="fog" args={["#050505", 10, 30]} />
            
            <ambientLight intensity={0.5} />
            <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} shadow-mapSize={[1024, 1024]} />
            
            <Suspense fallback={null}>
              {/* The Isometric Office Floor */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.5, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
              </mesh>

              {/* Render all 8 Agents (7 agents + 1 orchestrator) */}
              {agents.map((agent) => (
                <Agent3DNode key={agent.id} {...agent} />
              ))}

              <ContactShadows position={[0, -0.49, 0]} opacity={0.5} scale={20} blur={2} far={4.5} />
              <Environment preset="city" />
              <OrbitControls 
                enablePan={true} 
                enableZoom={true} 
                maxPolarAngle={Math.PI / 2.1} 
                minDistance={5} 
                maxDistance={25} 
              />
            </Suspense>
          </Canvas>
        </div>

      </div>

      {/* 3. HUD Bottom Panel: Real-time Master Console */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[800px] max-w-[90vw] h-44 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-10 flex flex-col pointer-events-auto overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
          <Terminal size={14} className="text-slate-400" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400">Master Execution Log</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-end">
          <div className="space-y-2 font-mono text-sm">
             {agents.filter(a => a.message).slice(-3).map((a, i) => (
                <div key={i} className="flex items-start gap-4 animate-fade-in-up">
                  <span className="text-slate-500 whitespace-nowrap">[{a.name}]</span>
                  <span className={a.status === "WORKING" ? "text-emerald-400" : "text-blue-400"}>
                    {a.message}
                  </span>
                </div>
             ))}
             {!agents.some(a => a.message) && (
               <div className="text-slate-600 italic">System ready. Input job specification and upload resume to deploy.</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
