import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { TaskModal } from './TaskModal.jsx';
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Calendar,
  DollarSign,
  UserCheck,
  Check,
} from 'lucide-react';

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter === 'pending') params.is_completed = 0;
      if (statusFilter === 'completed') params.is_completed = 1;
      if (employeeFilter !== 'all') params.employee_id = employeeFilter;

      const [taskData, empData] = await Promise.all([
        api.getTasks(params),
        api.getEmployees(),
      ]);
      setTasks(taskData);
      setEmployees(empData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter, employeeFilter]);

  const handleSaveTask = async (data) => {
    if (editingTask) {
      await api.updateTask(editingTask.Task_id, data);
    } else {
      await api.createTask(data);
    }
    loadTasks();
  };

  const handleToggleComplete = async (task) => {
    try {
      await api.completeTask(task.Task_id);
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete task ${id}?`)) {
      try {
        await api.deleteTask(id);
        loadTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-indigo-400" /> Tailor Tasks &amp; Piece-Work
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Assign garment production tasks, track tailor completion, and compute piece-rate pay
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-950/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Manual Task
        </button>
      </div>

      {/* Filter row */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Employee Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <select
            value={employeeFilter}
            onChange={e => setEmployeeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full md:w-56"
          >
            <option value="all">All Tailors &amp; Staff</option>
            {employees.map(e => (
              <option key={e.Employee_id} value={e.Employee_id}>
                {e.full_name} ({e.Employee_id})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Grid of Tasks */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Tasks Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Manufacturing tasks are automatically created when new orders are placed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => {
            const isDone = task.is_completed === 1;

            return (
              <div
                key={task.Task_id}
                className={`bg-slate-900/80 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                  isDone ? 'border-slate-800/60 opacity-80' : 'border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {task.Task_id}
                    </span>
                    {isDone ? (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> In Progress
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-slate-400">
                      Order: <strong className="text-slate-200">{task.Order_id}</strong> ({task.customer_name})
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      Tailor: {task.employee_name || 'Unassigned'}
                    </div>
                  </div>

                  {/* Fee and Date */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-400" /> Task Fee
                      </span>
                      <div className="font-bold text-emerald-400 text-sm mt-0.5">
                        LKR {task.fee?.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" /> Target Date
                      </span>
                      <div className="font-bold text-slate-200 text-xs mt-0.5 truncate">
                        {task.complete_at}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Mark Pending' : 'Complete Task'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.Task_id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
};
