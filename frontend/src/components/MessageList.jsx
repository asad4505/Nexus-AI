import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'
import { Code2, FileText, Globe, ImageIcon, MessageSquare, Presentation, Zap } from 'lucide-react'

// One-line summaries shown on the empty home screen
const AGENT_CARDS = [
  {
    icon: Zap,
    label: 'Auto',
    color: '#818cf8',
    description: 'Automatically picks the best agent for your task. Great for general use.',
  },
  {
    icon: MessageSquare,
    label: 'Chat',
    color: '#34d399',
    description: 'Conversational AI for Q&A, brainstorming, writing, and explanations.',
  },
  {
    icon: Code2,
    label: 'Coding',
    color: '#60a5fa',
    description: 'Writes, reviews, and debugs code across any programming language.',
  },
  {
    icon: FileText,
    label: 'PDF',
    color: '#f87171',
    description: 'Upload a PDF and ask questions, get summaries, or extract key info.',
  },
  {
    icon: Presentation,
    label: 'PPT',
    color: '#fb923c',
    description: 'Generates structured PowerPoint presentations from your prompts.',
  },
  {
    icon: ImageIcon,
    label: 'Vision',
    color: '#e879f9',
    description: 'Understands and describes images — upload a photo and ask anything.',
  },
  {
    icon: Globe,
    label: 'Search',
    color: '#38bdf8',
    description: 'Searches the web in real time and summarises up-to-date results.',
  },
]

function MessageList() {
    const {selectedConversation}=useSelector(state=>state.conversation)
    const {messages,isLoading}=useSelector(state=>state.message)
    const bottemRef=useRef(null)
   
   useEffect(()=>{
       requestAnimationFrame(()=>{
        bottemRef?.current?.scrollIntoView({
          behavior:"smooth",
          block:"end"
        })
       })
   },[messages?.length,isLoading])


  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      
      {messages.length==0 || !selectedConversation ?(
        <div className="min-h-full flex flex-col items-center justify-center gap-6 text-center py-8">
           {/* Heading */}
           <div className='flex flex-col gap-1.5'>
               <h1 className='text-[20px] font-semibold text-slate-200 tracking-tight'>Nexus AI</h1>
               <p className='text-[15px] font-semibold text-slate-400 tracking-tight'>How can I help you?</p>
               <p className='text-[13px] text-slate-600 max-w-[260px] leading-relaxed'>Ask me anything — code, ideas, explanations, or just a quick question.</p>
           </div>

           {/* Quick-start suggestion chips */}
           <div className='flex flex-wrap justify-center gap-2'>
            {["Write a Netflix clone", "Explain Redis", "Build a dashboard"].map((s)=>(
              <button key={s} className='text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3.5 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer'>
                {s}
              </button>
            ))}
           </div>

           {/* ── Agent capability cards ── */}
           <div className='w-full max-w-[720px]'>
             <p className='text-[11px] uppercase tracking-widest text-slate-600 mb-3 font-medium'>
               Available Agents
             </p>
             <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5'>
               {AGENT_CARDS.map(({ icon: Icon, label, color, description }) => (
                 <div
                   key={label}
                   className='flex flex-col gap-2 bg-white/[0.025] border border-white/[0.06] rounded-xl px-3.5 py-3 text-left hover:bg-white/[0.045] hover:border-white/[0.10] transition-all duration-150 group'
                 >
                   {/* Icon badge */}
                   <div
                     className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0'
                     style={{ backgroundColor: `${color}18` }}
                   >
                     <Icon size={14} style={{ color }} />
                   </div>

                   {/* Label */}
                   <span className='text-[12px] font-semibold text-slate-300 group-hover:text-slate-100 transition-colors'>
                     {label}
                   </span>

                   {/* Description */}
                   <p className='text-[11px] text-slate-600 group-hover:text-slate-500 leading-relaxed transition-colors'>
                     {description}
                   </p>
                 </div>
               ))}
             </div>
           </div>
        </div>
      ):
      <div className='space-y-5'>

        {messages?.map((msg,i)=>(
            <div key={i}>
               <MessageBubble role={msg?.role} content={msg?.content} images={msg.images || []} /> 
            </div>
        ))}

        {isLoading && <LoadingAnimation/>}

        
      </div>
      }
      <div ref={bottemRef}/>
    </div>
  )
}

export default MessageList
