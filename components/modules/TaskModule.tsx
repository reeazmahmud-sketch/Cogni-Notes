
import React, { useMemo } from 'react';
import { Note } from '../../types';
import { ListIcon, CheckSquareIcon, SparklesIcon } from '../common/Icon';

interface TaskModuleProps {
  note: Note;
  onUpdate: (content: string) => void;
}

const TaskModule: React.FC<TaskModuleProps> = ({ note, onUpdate }) => {
  const tasks = useMemo(() => {
    return note.content.split('\n').map((line, index) => {
      const match = line.match(/^\[( |x)\] (.*)/i);
      if (match) {
        return {
          index,
          completed: match[1].toLowerCase() === 'x',
          text: match[2]
        };
      }
      return null;
    }).filter((t): t is { index: number; completed: boolean; text: string } => t !== null);
  }, [note.content]);

  const toggleTask = (lineIndex: number) => {
    const lines = note.content.split('\n');
    const line = lines[lineIndex];
    if (line.startsWith('[ ] ')) {
      lines[lineIndex] = line.replace('[ ] ', '[x] ');
    } else if (line.startsWith('[x] ')) {
      lines[lineIndex] = line.replace('[x] ', '[ ] ');
    } else if (line.startsWith('[X] ')) {
      lines[lineIndex] = line.replace('[X] ', '[ ] ');
    }
    onUpdate(lines.join('\n'));
  };

  return (
    <div className="p-12 md:p-24 max-w-6xl mx-auto animate-in fade-in slide-in-from-right-10 duration-1000 space-y-20 font-['Hind_Siliguri']">
      <div className="flex items-center gap-10">
        <div className="p-8 bg-[#f26419]/10 rounded-[3rem] shadow-2xl border border-[#f26419]/20">
          <ListIcon className="w-14 h-14 text-[#f26419]" />
        </div>
        <div>
          <h2 className="text-5xl font-black text-slate-100 tracking-tighter">টাস্ক ম্যানেজার</h2>
          <p className="text-slate-500 text-xl font-medium mt-2">"{note.title}" - এর ভেতর থেকে সংগৃহীত কাজসমূহ</p>
        </div>
      </div>

      <div className="grid gap-6">
        {tasks.length > 0 ? (
          tasks.map((task, i) => (
            <div 
              key={i} 
              onClick={() => toggleTask(task.index)}
              className="group flex items-center gap-10 bg-[#1a212f]/40 p-10 rounded-[2.5rem] border border-slate-800/60 hover:border-[#f26419]/30 hover:bg-[#1a212f]/60 cursor-pointer transition-all duration-700 shadow-2xl backdrop-blur-sm"
            >
              <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center border-2 transition-all duration-700 ${
                task.completed 
                    ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-90' 
                    : 'border-slate-700 group-hover:border-[#f26419] bg-[#0c111d]'
              }`}>
                {task.completed && <span className="text-white text-xl font-black">✓</span>}
              </div>
              <div className="flex-1">
                <span className={`text-3xl font-bold transition-all duration-700 ${task.completed ? 'text-slate-600 line-through' : 'text-slate-200'}`}>
                  {task.text || <em className="text-slate-700 font-normal">অজ্ঞাত কাজ</em>}
                </span>
                <p className={`text-[11px] font-black uppercase tracking-[0.3em] mt-3 ${task.completed ? 'text-emerald-500' : 'text-slate-600'}`}>
                    {task.completed ? 'ধাপ সম্পন্ন' : 'পর্যালোচনা বাকি'}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-5 group-hover:translate-x-0">
                <CheckSquareIcon className="w-8 h-8 text-[#f26419]/30" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-52 bg-[#1a212f]/10 rounded-[5rem] border-2 border-dashed border-slate-800/40">
            <div className="relative inline-block mb-12">
                <CheckSquareIcon className="w-28 h-28 text-slate-800/30 mx-auto" />
                <SparklesIcon className="w-12 h-12 absolute -top-4 -right-4 text-[#f26419]/20 animate-pulse" />
            </div>
            <p className="text-slate-600 text-3xl font-medium tracking-wide">কোনো কাজ খুঁজে পাওয়া যায়নি</p>
            <p className="text-slate-800 text-[12px] mt-8 uppercase tracking-[0.4em] font-black">স্মার্ট এডিটরে ফিরে যান এবং '[ ]' টাইপ করুন</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModule;
