import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useTasks } from '../hooks/useTasks';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending', priority: 'medium' });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = [
    { label: 'Total Tasks', value: tasks.length, color: 'bg-blue-500', icon: Clock },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: 'bg-green-500', icon: CheckCircle2 },
    { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: 'bg-amber-500', icon: Clock },
    { label: 'High Priority', value: tasks.filter(t => t.priority === 'high').length, color: 'bg-red-500', icon: AlertCircle },
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
      } else {
        await createTask(formData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending', priority: 'medium' });
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({ 
      title: task.title, 
      description: task.description || '', 
      status: task.status, 
      priority: task.priority 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'low': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight transition-all">My Workspace</h1>
            <p className="text-slate-500 mt-1">Manage and track your tasks efficiently</p>
          </div>
          <button 
            onClick={() => {
              setEditingTask(null);
              setFormData({ title: '', description: '', status: 'pending', priority: 'medium' });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Task
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`${stat.color} p-3 rounded-2xl text-white`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-600 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredTasks.map((task) => (
              <motion.div
                layout
                key={task._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(task)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{task.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                  {task.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-2">
                    {task.status === 'completed' ? (
                      <div className="flex items-center text-green-600 text-xs font-bold uppercase">
                        <CheckCircle2 size={16} className="mr-1" />
                        Done
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600 text-xs font-bold uppercase">
                        <Clock size={16} className="mr-1" />
                        {task.status.replace('-', ' ')}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No tasks found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters, or add a new task.</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingTask ? 'Edit Task' : 'New Task'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 text-left">Title</label>
                  <input 
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="Morning meditation..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 text-left">Description</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
                    placeholder="Details about the task..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 text-left">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 text-left">Priority</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                  >
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
